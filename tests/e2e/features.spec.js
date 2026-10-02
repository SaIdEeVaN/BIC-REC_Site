import { test, expect } from '@playwright/test'
import { events, isUpcoming } from '../../src/data/events.js'
import { RECRUITMENT_RESULTS_OPEN, RECRUITMENT_RESULTS_URL } from '../../src/data/club.js'
import { associates } from '../../src/data/associates.js'
import { albumPath, albums } from '../../src/data/gallery.js'
import { boardMembers, coreTeamMembers, memberPath } from '../../src/data/members.js'

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
  await page.clock.setFixedTime(new Date('2026-02-10T10:00:00'))

  await page.goto('/')
  await expect(page.getByRole('link', { name: /next event/i })).toContainText('Byte the Dust')

  await page.goto('/events')
  await expect(page.locator('main').getByText('Upcoming', { exact: true }).first()).toBeVisible()
})

test('recruitment is over: an old /join link lands on the associates page', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/join')
  await expect(page).toHaveURL('/team/associates')
  await expect(page.locator('header').getByRole('link', { name: 'Join', exact: true })).toHaveCount(0)
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

test('the Associates page follows the recruitment results switch', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/team/associates')
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

test('the Associates page lists the associates once they are published, filtered by domain', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/team/associates')
  const roster = page.locator('#associates-roster')
  if (associates.length === 0) {
    await expect(roster).toHaveCount(0)
    return
  }
  await expect(roster.locator('li')).toHaveCount(associates.length)
  const team = associates[0].team
  await page.getByRole('group', { name: 'Filter the associates by domain' }).getByRole('button', { name: team, exact: true }).click()
  await expect(roster.locator('li')).toHaveCount(associates.filter((m) => m.team === team).length)
})

test('Meet us leads to the board, the core team and the associates', async ({ page }, testInfo) => {
  once(testInfo)

  for (const [name, path] of [
    ['Board members', '/team/board'],
    ['Core members', '/team/core'],
    ['Associate members', '/team/associates'],
  ]) {
    await page.goto('/team')
    await page.locator('main').getByRole('link', { name: new RegExp(name) }).click()
    await expect(page).toHaveURL(path)
    // On the team's own page, its cell in the Meet us switcher is marked as the current page.
    await expect(page.locator('main a[aria-current="page"]')).toHaveAttribute('href', path)
  }
})

test('the board and the core team list their own members, each linking to their own page', async ({ page }, testInfo) => {
  once(testInfo)

  for (const [path, members] of [
    ['/team/board', boardMembers],
    ['/team/core', coreTeamMembers],
  ]) {
    await page.goto(path)
    const links = page.locator('main ul.cells a[href^="/team/board/"], main ul.cells a[href^="/team/core/"]')
    await expect(links).toHaveCount(members.length)
    await expect(links.first()).toHaveAttribute('href', memberPath(members[0]))
  }
})

test("an old /team/board link to a core member's page lands on their page under /team/core", async ({ page }, testInfo) => {
  once(testInfo)

  const member = coreTeamMembers[0]
  await page.goto(`/team/board/${member.slug}`)
  await expect(page).toHaveURL(memberPath(member))
  await expect(page.locator('main h1')).toContainText(member.name)
})

test('every gallery album shows its photos, and each one loads', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/gallery')
  for (const album of albums) {
    const section = page.locator(`section[aria-labelledby="album-${album.slug}"]`)
    await expect(section.getByRole('heading', { name: album.title })).toBeVisible()
    const images = section.locator('ul.cells img')
    await expect(images).toHaveCount(album.photos.length)
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0)
    }
  }
})

test('a gallery photo opens full size, steps through its album, and closes back to where it was', async ({ page }, testInfo) => {
  once(testInfo)

  const album = albums[0]
  await page.goto('/gallery')
  const photos = page.locator(`section[aria-labelledby="album-${album.slug}"] ul.cells button`)
  await photos.nth(0).click()

  const viewer = page.getByRole('dialog')
  await expect(viewer).toBeVisible()
  await expect(viewer).toContainText(album.photos[0].caption)
  await expect(viewer.getByRole('img', { name: album.photos[0].alt })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(viewer).toContainText(album.photos[1].caption)
  await viewer.getByRole('button', { name: /previous/i }).click()
  await expect(viewer).toContainText(album.photos[0].caption)
  // Wraps round: previous from the first photo is the last.
  await page.keyboard.press('ArrowLeft')
  await expect(viewer).toContainText(album.photos.at(-1).caption)

  await page.keyboard.press('Escape')
  await expect(viewer).toBeHidden()
  await expect(photos.nth(0)).toBeFocused()
})

test('an event with an album shows its photos and leads to that album alone, and back', async ({ page }, testInfo) => {
  once(testInfo)

  const event = events.find((e) => e.album)
  const album = albums.find((a) => a.slug === event.album)
  await page.goto(`/events/${event.id}`)
  await expect(page.getByRole('img', { name: album.photos[0].alt })).toBeVisible()

  await page.getByRole('link', { name: `See all ${album.photos.length} photos` }).click()
  await expect(page).toHaveURL(albumPath(album))
  await expect(page.locator('main h1')).toContainText(album.title)
  // This album's photos, and no other album's.
  await expect(page.locator('main ul.cells img')).toHaveCount(album.photos.length)
  for (const other of albums.filter((a) => a !== album)) {
    await expect(page.getByRole('heading', { name: other.title })).toHaveCount(0)
  }

  // The full view works here too.
  await page.locator('main ul.cells button').first().click()
  await expect(page.getByRole('dialog')).toContainText(album.photos[0].caption)
  await page.keyboard.press('Escape')

  await page.getByRole('link', { name: 'About the event' }).click()
  await expect(page).toHaveURL(`/events/${event.id}`)
  await expect(page.locator('main h1')).toContainText(event.title)
})

test('every album has its own page, linked from its title in the gallery', async ({ page }, testInfo) => {
  once(testInfo)

  const album = albums.at(-1)
  await page.goto('/gallery')
  await page.getByRole('link', { name: album.title, exact: true }).click()
  await expect(page).toHaveURL(albumPath(album))
  await expect(page.locator('main ul.cells img')).toHaveCount(album.photos.length)

  await page.goto('/gallery/no-such-album')
  await expect(page.getByText("There's no album at this address")).toBeVisible()
})

test('an event without photos yet says so', async ({ page }, testInfo) => {
  once(testInfo)

  const event = events.find((e) => !e.album)
  await page.goto(`/events/${event.id}`)
  await expect(page.getByText('Photos from this event haven’t been uploaded yet.')).toBeVisible()
})
