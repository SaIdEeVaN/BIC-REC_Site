import { test, expect } from '@playwright/test'
import { measureOverflow, overflowMessage } from './overflow.js'

test.use({ reducedMotion: 'no-preference' })

// Scroll through the whole page so every in-view animation fires, then let springs settle.
async function playAllAnimations(page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
  })
  await page.waitForTimeout(2000)
}

const animatedRoutes = ['/', '/about', '/events', '/events/3', '/projects', '/gallery', '/team/core', '/join', '/contact']

for (const route of animatedRoutes) {
  test(`${route} fits the viewport with animations on`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('main :is(h1, h2)').first()).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    await playAllAnimations(page)

    const result = await measureOverflow(page)
    expect(result.scrollWidth, overflowMessage(route, result)).toBeLessThanOrEqual(result.viewport)
  })
}

test('home animations land on the real content', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'one viewport is enough')

  await page.goto('/')
  await playAllAnimations(page)

  // Number tickers finish on their values; decrypted hashes resolve to the real hash.
  await expect(page.locator('dd span[aria-hidden="true"]', { hasText: /^60\+$/ })).toBeVisible()
  await expect(page.locator('span[aria-hidden="true"]', { hasText: /^0xb51…e50$/ }).first()).toBeVisible()
})

test('hovering a track card picks it up onto a longer shadow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'hover needs a mouse; one viewport is enough')

  await page.goto('/about')
  await playAllAnimations(page)
  const card = page.locator('main article').first()
  await card.hover()
  await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -4, -4)')
})

test('a gallery filter reshuffles to exactly the matching frames', async ({ page }) => {
  await page.goto('/gallery')
  const frames = page.locator('main ul.cells > li')
  await expect(frames).toHaveCount(12)

  await page.getByRole('button', { name: 'Workshops', exact: true }).click()
  await expect(frames).toHaveCount(2)
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await expect(frames).toHaveCount(12)

  await page.waitForTimeout(1000)
  const result = await measureOverflow(page)
  expect(result.scrollWidth, overflowMessage('/gallery after filtering', result)).toBeLessThanOrEqual(result.viewport)
})

test('the kinetic band keeps running', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'one viewport is enough')

  await page.goto('/about')
  const band = page.locator('.t-band')
  // The band never holds still, so Playwright's wait-for-stable scroll would time out: scroll its fixed strip instead.
  await band.evaluate((el) => el.parentElement.scrollIntoView({ block: 'center' }))
  const transform = () => band.evaluate((el) => getComputedStyle(el).transform)
  const first = await transform()
  await expect.poll(transform).not.toBe(first)
})
