import { test, expect } from '@playwright/test'
import { measureOverflow, overflowMessage } from './overflow.js'
import { stats } from '../../src/data/achievements.js'

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

const animatedRoutes = ['/', '/about', '/events', '/events/3', '/projects', '/gallery', '/team', '/team/core', '/team/associates', '/contact']

// Animation overflow shows up at the extremes: the narrowest column, where a drifting block has the
// least room, and the widest, where the hero's drift travels furthest. The breakpoints between them
// only interpolate, so running all five multiplied the slowest tests in the suite for no new signal.
const MOTION_WIDTHS = ['mobile-360', 'desktop-1280']

for (const route of animatedRoutes) {
  test(`${route} fits the viewport with animations on`, async ({ page }, testInfo) => {
    test.skip(!MOTION_WIDTHS.includes(testInfo.project.name), 'the extreme widths are what catch this')
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

  // Number tickers finish on their values; decrypted hashes resolve to the real hash. The member count
  // is read from the club's figures rather than written out here, so correcting a number doesn't fail
  // a test about whether the ticker arrives.
  await expect(
    page.locator('dd span[aria-hidden="true"]').filter({ hasText: new RegExp(`^${stats.members}$`) })
  ).toBeVisible()
  await expect(page.locator('span[aria-hidden="true"]', { hasText: /^0xb51…e50$/ }).first()).toBeVisible()
})

test('every scroll reveal below the fold lands at rest', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'one viewport is enough')

  // /projects carries the most reveals: the tab strip, the chart and one per build row.
  await page.goto('/projects')
  await expect(page.locator('main h1')).toBeVisible()

  const pending = page.locator('.reveal:not(.reveal--in)')
  expect(await pending.count(), 'reveals should start held below their resting place').toBeGreaterThan(0)

  await playAllAnimations(page)

  // Every reveal fired...
  await expect(pending).toHaveCount(0)

  // ...and actually settled, rather than being left holding a translate the transition never ran on.
  const offsets = await page.locator('.reveal').evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).translate).filter((value) => value !== 'none' && value !== '0px'),
  )
  expect(offsets, 'settled reveals should have no leftover translate').toEqual([])
})

test('the scroll progress bar tracks a long, lazily-grown page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'one viewport is enough')

  // Regression: the bar used to be measured once, before a route's lazy chunk made the page taller,
  // and stuck full at the top of every long page.
  const bar = page.locator('header span.origin-left')

  await page.goto('/events')
  await expect(page.locator('main h1')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)

  const atTop = await bar.evaluate((el) => el.getBoundingClientRect().width)
  const viewport = page.viewportSize().width
  expect(atTop, 'bar should be near-empty at the top of the page').toBeLessThan(viewport * 0.2)

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(1200)

  const atBottom = await bar.evaluate((el) => el.getBoundingClientRect().width)
  expect(atBottom, 'bar should be full at the bottom').toBeGreaterThan(viewport * 0.9)
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
