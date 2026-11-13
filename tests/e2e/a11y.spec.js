import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { events } from '../../src/data/events.js'
import { albumPath, albums } from '../../src/data/gallery.js'
import { associateMembers, boardMembers, coreTeamMembers, memberPath } from '../../src/data/members.js'
import { staticRoutes } from '../../src/seo.js'

// Automated accessibility checks (axe-core) against WCAG 2.1 A and AA: contrast, names for links, buttons and
// form fields, heading order, landmarks, ARIA used correctly. A machine finds maybe a third of what a person
// with a screen reader would, so passing this is a floor, not a verdict.
//
// One of each layout, as in pages.spec.js: the pages that are their own layout, and one page from each template.
const templated = new Set([
  ...events.map((event) => `/events/${event.id}`),
  ...albums.map(albumPath),
  ...[...boardMembers, ...coreTeamMembers, ...associateMembers].map(memberPath),
])

const routes = [
  ...staticRoutes.filter((route) => !templated.has(route)),
  `/events/${events.at(-1).id}`,
  albumPath(albums[0]),
  memberPath(boardMembers[0]),
  '/this-page-does-not-exist',
]

// The layout changes with the width but the markup barely does: a phone and a desktop cover both navigations
// (the menu and the bar). Each theme has its own colours, so contrast is checked in both.
const WIDTHS = ['mobile-390', 'desktop-1280']

const scan = (page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()

// One line per failing element, so the failure message says what to fix.
const report = (violations) =>
  violations.flatMap((violation) =>
    violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')} — ${node.failureSummary.split('\n')[1]?.trim()}`),
  )

for (const theme of ['light', 'dark']) {
  for (const route of routes) {
    test(`${route} has no accessibility violations a machine can find (${theme})`, async ({ page }, testInfo) => {
      test.skip(!WIDTHS.includes(testInfo.project.name), 'a phone and a desktop cover both layouts')

      if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('bic-theme', 'dark'))
      await page.goto(route)
      await expect(page.locator('main :is(h1, h2)').first()).toBeVisible()
      await page.evaluate(() => document.fonts.ready)

      expect(report((await scan(page)).violations)).toEqual([])
    })
  }
}

test('the phone menu, once open, has no accessibility violations a machine can find', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'only phones have the menu')

  await page.goto('/')
  await page.locator('header').getByRole('button', { name: /menu/i }).click()
  await expect(page.locator('header').getByRole('link', { name: 'Contact us' })).toBeVisible()

  expect(report((await scan(page)).violations)).toEqual([])
})

test('the photo viewer, once open, has no accessibility violations a machine can find', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280', 'the viewer is the same at every width')

  await page.goto(albumPath(albums[0]))
  await page.locator('main ul.cells button').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()

  expect(report((await scan(page)).violations)).toEqual([])
})
