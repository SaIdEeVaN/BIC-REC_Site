import { test, expect } from '@playwright/test'
import { metaFor, renderSeoTags, staticRoutes } from '../../src/seo.js'
import { events } from '../../src/data/events.js'
import { albumPath, albums } from '../../src/data/gallery.js'
import { boardMembers, coreTeamMembers, memberPath, teamMembers } from '../../src/data/members.js'
import { findOversizedHeadingWords, measureOverflow, overflowMessage } from './overflow.js'

// 48 routes, but only 13 distinct layouts: the other 35 are three templates — an event, an album and a member
// (board or core) — rendered with different text. Laying out the 24th member proves nothing the 1st didn't,
// so what gets measured is every distinct layout plus the worst case of each template. Long content
// is what breaks these pages, and the worst case is derived from the data rather than pinned to a
// name, so it follows the roster instead of going stale when it changes.
const longestBy = (items, pick) => items.reduce((a, b) => (pick(b).length >= pick(a).length ? b : a))

const templated = new Set([
  ...events.map((e) => `/events/${e.id}`),
  ...albums.map(albumPath),
  ...teamMembers.map(memberPath),
])

const worstCase = [
  `/events/${longestBy(events, (e) => e.title).id}`,
  albumPath(longestBy(albums, (a) => a.title)),
  // An album's grid depends on how many photos it has, so the smallest and the largest are both laid out.
  albumPath(albums.reduce((a, b) => (b.photos.length < a.photos.length ? b : a))),
  albumPath(albums.reduce((a, b) => (b.photos.length > a.photos.length ? b : a))),
  memberPath(longestBy(teamMembers, (m) => m.name)),
  memberPath(longestBy(teamMembers, (m) => m.email ?? '')),
  // Not every difference is text length. The first and last member of each team have one neighbour rather
  // than two, so their previous/next row is a different grid — that asymmetry has already shipped a bug
  // once (an empty cell showing the ink background as a black slab), so both ends stay covered.
  memberPath(boardMembers[0]),
  memberPath(boardMembers.at(-1)),
  memberPath(coreTeamMembers[0]),
  memberPath(coreTeamMembers.at(-1)),
]

const routes = [
  ...staticRoutes.filter((route) => !templated.has(route)),
  ...new Set(worstCase),
  '/this-page-does-not-exist',
]

// Every route still gets its share tags checked below — that loop runs over all of staticRoutes.

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

    // Reduced motion strips transitions globally, which would otherwise leave every scroll reveal
    // holding the offset its transition was going to animate away.
    const stranded = await page.locator('.reveal').evaluateAll((nodes) =>
      nodes
        .map((node) => getComputedStyle(node).translate)
        .filter((value) => value !== 'none' && value !== '0px'),
    )
    expect(stranded, `${route} strands scroll reveals when motion is reduced`).toEqual([])
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
