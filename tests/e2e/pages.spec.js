import { test, expect } from '@playwright/test'
import { metaFor, renderSeoTags, staticRoutes } from '../../src/seo.js'

const routes = [...staticRoutes, '/this-page-does-not-exist']

for (const route of routes) {
  test(`${route} fits the viewport and has its own title`, async ({ page }) => {
    await page.goto(route)
    // Pages are lazy-loaded: wait for real content, then for webfonts (they change text widths).
    await expect(page.locator('main :is(h1, h2)').first()).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    await expect(page).toHaveTitle(metaFor(route).title)

    const result = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth
      const offenders = []
      for (const el of document.body.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect()
        // scrollWidth also catches text spilling out of a normally sized box (long unbreakable words).
        const right = Math.max(rect.right, rect.left + el.scrollWidth)
        if (rect.width === 0 || right <= viewport + 1) continue
        // Content inside an overflow-clipping ancestor (e.g. the header ticker) can't cause page scroll.
        let clipped = false
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).overflowX !== 'visible') {
            clipped = true
            break
          }
        }
        if (!clipped) {
          const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 4).join('.') : ''
          offenders.push(`<${el.tagName.toLowerCase()}${cls ? ` .${cls}` : ''}> right edge ${Math.round(right)}px`)
        }
      }
      return { viewport, scrollWidth: document.documentElement.scrollWidth, offenders: offenders.slice(0, 5) }
    })

    expect(
      result.scrollWidth,
      `${route} scrolls sideways (${result.scrollWidth}px > ${result.viewport}px). Widest elements:\n${result.offenders.join('\n')}`
    ).toBeLessThanOrEqual(result.viewport)
  })
}

// The raw HTML is what link-preview crawlers see, and it's the same at every viewport — check it once.
for (const route of staticRoutes) {
  test(`${route} serves its own share tags without JavaScript`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1280', 'HTML is identical across viewports')

    const response = await request.get(route)
    expect(response.ok()).toBeTruthy()
    expect(await response.text()).toContain(renderSeoTags(metaFor(route)))
  })
}
