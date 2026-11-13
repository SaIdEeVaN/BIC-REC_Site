import { test, expect } from '@playwright/test'
import { metaFor, renderSeoTags, renderStructuredData, staticRoutes, structuredDataFor } from '../../src/seo.js'
import { events } from '../../src/data/events.js'
import { albumPath, albums } from '../../src/data/gallery.js'
import { associateMembers, boardMembers, coreTeamMembers, memberPages, memberPath } from '../../src/data/members.js'
import { findOversizedHeadingWords, measureOverflow, overflowMessage } from './overflow.js'
import { watchPolicy } from './policy.js'
import { imageFor, metaWithImage } from '../../scripts/share-cards.js'

// 96 routes, but only 12 distinct layouts: the other 84 are three templates — an event, an album and a member
// (board, core or associate) — rendered with different text. Laying out the 70th member proves nothing the 1st didn't,
// so what gets measured is every distinct layout plus the worst case of each template. Long content
// is what breaks these pages, and the worst case is derived from the data rather than pinned to a
// name, so it follows the roster instead of going stale when it changes.
const longestBy = (items, pick) => items.reduce((a, b) => (pick(b).length >= pick(a).length ? b : a))

const templated = new Set([
  ...events.map((e) => `/events/${e.id}`),
  ...albums.map(albumPath),
  ...memberPages.map(memberPath),
])

const worstCase = [
  `/events/${longestBy(events, (e) => e.title).id}`,
  albumPath(longestBy(albums, (a) => a.title)),
  // An album's grid depends on how many photos it has, so the smallest and the largest are both laid out.
  albumPath(albums.reduce((a, b) => (b.photos.length < a.photos.length ? b : a))),
  albumPath(albums.reduce((a, b) => (b.photos.length > a.photos.length ? b : a))),
  memberPath(longestBy(memberPages, (m) => m.name)),
  memberPath(longestBy(memberPages, (m) => m.email ?? '')),
  // Not every difference is text length. The first and last member of each team have one neighbour rather
  // than two, so their previous/next row is a different grid — that asymmetry has already shipped a bug
  // once (an empty cell showing the ink background as a black slab), so both ends stay covered.
  memberPath(boardMembers[0]),
  memberPath(boardMembers.at(-1)),
  memberPath(coreTeamMembers[0]),
  memberPath(coreTeamMembers.at(-1)),
  ...(associateMembers.length ? [memberPath(associateMembers[0]), memberPath(associateMembers.at(-1))] : []),
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
    const blocked = watchPolicy(page)
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

    expect(blocked, `${route} loads something the Content-Security-Policy blocks`).toEqual([])
  })
}

// The raw HTML is what link-preview crawlers see, and it's the same at every viewport — check it once.
for (const route of staticRoutes) {
  test(`${route} serves its own share tags without JavaScript`, async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1280', 'HTML is identical across viewports')

    const response = await request.get(route)
    expect(response.ok()).toBeTruthy()
    const html = await response.text()
    // The tags as the build writes them: with the page's own share image where one has been drawn.
    expect(html).toContain(renderSeoTags(metaWithImage(route)))

    // An image a page names has to be there to fetch, or the link previews with nothing at all.
    const image = imageFor(route)
    if (image) {
      const picture = await request.get(image.path)
      expect(picture.ok(), `${route} names ${image.path}`).toBeTruthy()
      expect(picture.headers()['content-type']).toMatch(/^image\/(png|jpeg)$/)
    }

    // Structured data is for the pages that have some (the club on the home page, an event on its own page),
    // and no other page may carry any.
    const data = structuredDataFor(route)
    if (data) expect(html).toContain(renderStructuredData(data))
    else expect(html).not.toContain('application/ld+json')
  })
}

// What follows is about the files Firebase serves, so it reads them without a browser, once.
const once = (testInfo) => test.skip(testInfo.project.name !== 'desktop-1280', 'the files are the same at every width')

test('structured data states each event as the events page does', () => {
  once(test.info())

  expect(structuredDataFor('/')).toMatchObject({ '@type': 'Organization', url: metaFor('/').url })
  for (const event of events) {
    const data = structuredDataFor(`/events/${event.id}`)
    expect(data).toMatchObject({ '@type': 'Event', name: event.title, url: metaFor(`/events/${event.id}`).url })
    expect(data.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(data.endDate >= data.startDate).toBe(true)
  }
  // The date is the calendar date as written, in no time zone.
  expect(structuredDataFor('/events/1')).toMatchObject({ startDate: '2025-09-18', endDate: '2025-09-18' })
})

test("a core member's old /team/board address still serves their page, naming the new address", async ({ request }, testInfo) => {
  once(testInfo)

  for (const member of coreTeamMembers) {
    const response = await request.get(`/team/board/${member.slug}`)
    expect(response.ok()).toBeTruthy()
    expect(await response.text()).toContain(renderSeoTags(metaWithImage(memberPath(member))))
  }
})

test('an address with no page gets the 404 page, which is the app and is kept out of search', async ({ request }, testInfo) => {
  once(testInfo)

  // Firebase answers any address that has no file with 404.html and a 404 status. The preview server can't
  // reproduce the status (it falls back to index.html), so this checks the file Firebase will reach for.
  const html = await (await request.get('/404.html')).text()
  expect(html).toContain('<title>Block not found | BIC/REC</title>')
  expect(html).toContain('<meta name="robots" content="noindex" />')
  expect(html).not.toContain('rel="canonical"')
  expect(html).toMatch(/<script type="module"[^>]+src="\/assets\/index-/)
})

test('every response carries the security headers', async ({ request }, testInfo) => {
  once(testInfo)

  const headers = (await request.get('/')).headers()
  expect(headers['content-security-policy']).toContain("default-src 'self'")
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['x-frame-options']).toBe('SAMEORIGIN')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
})
