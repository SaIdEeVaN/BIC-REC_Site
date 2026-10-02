import { test, expect } from '@playwright/test'

const INK = 'rgb(20, 17, 14)'
const BONE = 'rgb(237, 230, 216)'

const background = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test('the dark theme is opt-in, flips the page, and is remembered', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')

  await page.goto('/')
  await expect(page.locator('main h1')).toBeVisible()
  expect(await background(page)).toBe(BONE)

  const toggle = page.locator('header').getByRole('button', { name: 'Dark theme' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()

  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await background(page)).toBe(INK)
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#14110E')

  // index.html applies the saved choice before the app's script has run, so nothing paints light first.
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await background(page)).toBe(INK)
  await page.unroute('**/assets/*.js')

  await page.reload()
  await page.locator('header').getByRole('button', { name: 'Dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(await background(page)).toBe(BONE)
})

test('a phone in dark mode still gets the light page, until the visitor picks the dark theme', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')
  await page.emulateMedia({ colorScheme: 'dark' })
  const scheme = page.locator('meta[name="color-scheme"]')

  await page.goto('/')
  await expect(page.locator('main h1')).toBeVisible()
  expect(await background(page)).toBe(BONE)
  // "only light" is what stops a phone browser's own dark mode from repainting the light page.
  await expect(scheme).toHaveAttribute('content', 'only light')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light only')

  const toggle = page.locator('header').getByRole('button', { name: 'Dark theme' })
  await toggle.click()
  await expect(scheme).toHaveAttribute('content', 'dark')
  await toggle.click()
  await expect(scheme).toHaveAttribute('content', 'only light')
})

test('text on amber stays dark in the dark theme', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')
  await page.addInitScript(() => localStorage.setItem('bic-theme', 'dark'))
  await page.clock.setFixedTime(new Date('2026-02-10T10:00:00'))

  await page.goto('/events')
  const upcoming = page.locator('main').getByText('Upcoming', { exact: true }).first()
  await expect(upcoming).toBeVisible()
  expect(await upcoming.evaluate((el) => getComputedStyle(el).color)).toBe(INK)

  await page.goto('/')
  const amberButton = page.locator('main a.btn-amber').first()
  await expect(amberButton).toBeVisible()
  expect(await amberButton.evaluate((el) => getComputedStyle(el).color)).toBe(INK)
})

test('on a phone the theme toggle sits at the foot of the menu', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-360', 'the header has room for it from sm up')

  await page.goto('/')
  await expect(page.locator('header').getByRole('button', { name: 'Dark theme' })).toBeHidden()

  await page.getByRole('button', { name: 'Menu' }).click()
  await page.locator('#mobile-nav').getByRole('button', { name: 'Dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
