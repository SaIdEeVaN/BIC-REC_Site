import { test, expect } from '@playwright/test'
import { metaFor, renderSeoTags, staticRoutes } from '../../src/seo.js'
import { findOversizedHeadingWords, measureOverflow, overflowMessage } from './overflow.js'

const routes = [...staticRoutes, '/this-page-does-not-exist']

// Runs with reduced motion (playwright.config.js), i.e. against the settled, final layout.
for (const route of routes) {
  test(`${route} fits the viewport and has its own title`, async ({ page }) => {
    await page.goto(route)
    // Pages are lazy-loaded: wait for real content, then for webfonts (they change text widths).
    await expect(page.locator('main :is(h1, h2)').first()).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    await expect(page).toHaveTitle(metaFor(route).title)

    const result = await measureOverflow(page)
    expect(result.scrollWidth, overflowMessage(route, result)).toBeLessThanOrEqual(result.viewport)

    expect(await findOversizedHeadingWords(page), `${route} has heading words wider than their column`).toEqual([])
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
