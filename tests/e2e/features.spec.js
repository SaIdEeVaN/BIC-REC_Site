import { test, expect } from '@playwright/test'
import { isUpcoming } from '../../src/data/events.js'
import { RECRUITMENT_RESULTS_URL } from '../../src/data/club.js'

// Behaviour is identical at every width, so these run once.
const once = (testInfo) => test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')

test('an event is upcoming until the end of its last day', () => {
  once(test.info())

  const hackathon = { date: 'February 20–21, 2026' }
  expect(isUpcoming(hackathon, new Date(2026, 1, 21, 22, 0))).toBe(true)
  expect(isUpcoming(hackathon, new Date(2026, 1, 22, 0, 1))).toBe(false)
  expect(isUpcoming({ date: 'May 10, 2026' }, new Date(2026, 4, 9))).toBe(true)
  expect(isUpcoming({ date: 'not a date' }, new Date(2026, 0, 1))).toBe(false)
})

test('once every event has passed, nothing says "Upcoming"', async ({ page }, testInfo) => {
  once(testInfo)
  await page.clock.setFixedTime(new Date('2026-09-14T10:00:00'))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Next event coming soon' })).toBeVisible()

  await page.goto('/events')
  await expect(page.locator('main h1')).toBeVisible()
  await expect(page.locator('main')).not.toContainText('Upcoming')
})

test('before an event, home promotes it and the ledger marks it upcoming', async ({ page }, testInfo) => {
  once(testInfo)
  await page.clock.setFixedTime(new Date('2026-04-01T10:00:00'))

  await page.goto('/')
  await expect(page.getByRole('link', { name: /next event/i })).toContainText('Smart Contract Development Bootcamp')

  await page.goto('/events')
  await expect(page.locator('main').getByText('Upcoming', { exact: true }).first()).toBeVisible()
})

test('Join opens the contact form with the subject filled in', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/join')
  await page.locator('main').getByRole('link', { name: 'Join the club' }).click()

  await expect(page).toHaveURL(/\/contact\?subject=Membership/)
  await expect(page.getByLabel('subject')).toHaveValue('Membership application')
})

test('the contact form hands the message to an email app addressed to the club', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/contact')
  await page.getByLabel('your name').fill('Asha')
  await page.getByLabel('email address').fill('asha@example.com')
  await page.getByLabel('subject').fill('Workshop collaboration')
  await page.getByLabel('message').fill('Hello BIC!')
  await page.getByRole('button', { name: 'Send via email' }).click()

  await expect(page.getByRole('heading', { name: 'Check your email app' })).toBeVisible()
  const retry = page.getByRole('link', { name: 'Open the email again' })
  await expect(retry).toHaveAttribute('href', /^mailto:kbaclub@rajalakshmi\.edu\.in\?subject=Workshop%20collaboration&body=Hello%20BIC!/)
})

test('Core Members sends visitors to the recruitment results site', async ({ page }, testInfo) => {
  once(testInfo)
  // Stand in for the results site, so the test never depends on it being up.
  await page.route(`${RECRUITMENT_RESULTS_URL}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>Recruitment results</h1>' }),
  )

  await page.goto('/team/core')
  await expect(page).toHaveURL(`${RECRUITMENT_RESULTS_URL}/`)

  // The footer link navigates inside the app, so it's the client-side redirect doing the work here.
  await page.goto('/')
  await page.locator('footer').getByRole('link', { name: 'Core Members' }).click()
  await expect(page).toHaveURL(`${RECRUITMENT_RESULTS_URL}/`)
  await page.goBack()
  await expect(page).toHaveURL(/localhost:4173\/$/)
})
