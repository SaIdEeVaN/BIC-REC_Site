import { test, expect } from '@playwright/test'
import { metaFor, renderSeoTags, staticRoutes } from '../../src/seo.js'
import { events } from '../../src/data/events.js'
import { boardMembers } from '../../src/data/members.js'
import { findOversizedHeadingWords, measureOverflow, overflowMessage } from './overflow.js'

// 43 routes, but only 12 distinct layouts: the other 31 are two templates — an event and a board
// member — rendered with different text. Laying out the 25th member proves nothing the 1st didn't,
// so what gets measured is every distinct layout plus the worst case of each template. Long content
// is what breaks these pages, and the worst case is derived from the data rather than pinned to a
// name, so it follows the roster instead of going stale when it changes.
const longestBy = (items, pick) => items.reduce((a, b) => (pick(b).length >= pick(a).length ? b : a))

const templated = new Set([
  ...events.map((e) => `/events/${e.id}`),
  ...boardMembers.map((m) => `/team/board/${m.slug}`),
])

const worstCase = [
  `/events/${longestBy(events, (e) => e.title).id}`,
  `/team/board/${longestBy(boardMembers, (m) => m.name).slug}`,
  `/team/board/${longestBy(boardMembers, (m) => m.email ?? '').slug}`,
  // Not every difference is text length. The first and last member have one neighbour rather than
  // two, so their previous/next row is a different grid — that asymmetry has already shipped a bug
  // once (an empty cell showing the ink background as a black slab), so both ends stay covered.
  `/team/board/${boardMembers[0].slug}`,
  `/team/board/${boardMembers.at(-1).slug}`,
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
