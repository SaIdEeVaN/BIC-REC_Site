import { test, expect } from '@playwright/test'
import { isUpcoming } from '../../src/data/events.js'
import { RECRUITMENT_RESULTS_OPEN, RECRUITMENT_RESULTS_URL } from '../../src/data/club.js'
import { coreMembers } from '../../src/data/coreMembers.js'

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
  await page.getByLabel('email address').fill('asha.k.2025.cse@rajalakshmi.edu.in')
  await page.getByLabel('subject').fill('Workshop collaboration')
  await page.getByLabel('message').fill('Hello BIC!')
  await page.getByRole('button', { name: 'Send via email' }).click()

  await expect(page.getByRole('heading', { name: 'Check your email app' })).toBeVisible()
  const retry = page.getByRole('link', { name: 'Open the email again' })
  await expect(retry).toHaveAttribute('href', /^mailto:kbaclub@rajalakshmi\.edu\.in\?subject=Workshop%20collaboration&body=Hello%20BIC!/)
})

test('the contact form only takes a college email address', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/contact')
  const email = page.getByLabel('email address')
  await email.fill('asha@gmail.com')
  await page.getByLabel('subject').focus()
  await expect(page.getByText('enter valid email id')).toBeVisible()
  await expect(email).toHaveAttribute('aria-invalid', 'true')

  await page.getByLabel('your name').fill('Asha')
  await page.getByLabel('subject').fill('Workshop collaboration')
  await page.getByLabel('message').fill('Hello BIC!')
  await page.getByRole('button', { name: 'Send via email' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email app' })).toHaveCount(0)
  expect(await email.evaluate((el) => el.validationMessage)).toBe('enter valid email id')

  await email.fill('asha.k.2025.cse@rajalakshmi.edu.in')
  await expect(page.getByText('enter valid email id')).toHaveCount(0)
})

test('Core Members follows the recruitment results switch', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/team/core')
  const hero = page.locator('main h2.t-hero')
  const check = page.locator('main').getByRole('link', { name: 'Check your result' })
  if (RECRUITMENT_RESULTS_OPEN) {
    await expect(hero).toContainText(/check/i)
    await expect(check).toHaveAttribute('href', RECRUITMENT_RESULTS_URL)
  } else {
    await expect(hero).toContainText(/coming/i)
    await expect(check).toHaveCount(0)
  }
})

test('Core Members lists the new core team once it is published, filtered by team', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/team/core')
  const roster = page.locator('#core-roster')
  if (coreMembers.length === 0) {
    await expect(roster).toHaveCount(0)
    return
  }
  await expect(roster.locator('li')).toHaveCount(coreMembers.length)
  const team = coreMembers[0].team
  await page.getByRole('group', { name: 'Filter the core team by team' }).getByRole('button', { name: team, exact: true }).click()
  await expect(roster.locator('li')).toHaveCount(coreMembers.filter((m) => m.team === team).length)
})
