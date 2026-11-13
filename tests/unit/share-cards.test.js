// The share images (scripts/share-cards.js): which picture a link to each page previews with.
//
// Nothing here fails because an image hasn't been drawn. A page whose card has changed falls back to the
// default image until `npm run share-images` is run, and that is allowed: adding a member must not stop a
// deploy. What is held is the rule that makes the fallback safe — an image is only used for the exact
// content it was drawn from.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { events } from '../../src/data/events.js'
import { blockOf, short } from '../../src/lib/ledger.js'
import { SITE_URL, metaFor, staticRoutes } from '../../src/seo.js'
import { PUBLIC, cardFor, defaultCard, fileFor, imageFor, keyOf, metaWithImage } from '../../scripts/share-cards.js'

test('every page but the home page has a card of its own, and an address with no page has none', () => {
  for (const route of staticRoutes) {
    if (route === '/') assert.equal(cardFor(route), null, 'the home page uses the default image')
    else assert.ok(cardFor(route), `${route} has no card`)
  }
  assert.equal(cardFor('/this-page-does-not-exist'), null)
  assert.equal(cardFor('/events/9999'), null)
  assert.equal(cardFor('/team/board/nobody'), null)
})

test("a card says what the page is: an event's block, a member's name and role", () => {
  for (const event of events) {
    const card = cardFor(`/events/${event.id}`)
    assert.equal(card.title, event.title)
    assert.ok(card.eyebrow.includes(short(blockOf(event).hash)), 'the event’s real hash')
    assert.ok(card.body.includes(event.date))
    assert.equal(card.rail.nodes, events.length)
  }
  const card = cardFor('/about')
  assert.equal(card.title, 'About us')
  assert.equal(card.body, metaFor('/about').description)
  assert.equal(defaultCard.title, 'BIC/REC')
})

test("each card's image has a name of its own that carries its key", () => {
  const files = staticRoutes.filter(cardFor).map((route) => fileFor(route, cardFor(route)))
  assert.equal(new Set(files).size, files.length)
  for (const file of files) assert.match(file, /^og\/[a-z0-9-]+\.[0-9a-f]{10}\.(png|jpg)$/)
})

test('the key follows the content: any change to what is drawn gives the image a new name', () => {
  const card = cardFor('/events/1')
  assert.equal(keyOf(card), keyOf({ ...card }), 'the same card, the same key')
  for (const change of [{ title: `${card.title}!` }, { body: 'another day' }, { eyebrow: 'block #9999' }, { url: 'elsewhere' }]) {
    assert.notEqual(keyOf({ ...card, ...change }), keyOf(card), JSON.stringify(change))
  }

  // A photo is part of the picture: the same words over a different photograph is a different image.
  const [first, second] = staticRoutes.map(cardFor).filter((c) => c?.photo)
  assert.notEqual(keyOf({ ...first, photo: second.photo }), keyOf(first))
})

test('a page names its own image only when that exact image exists, and the default otherwise', () => {
  for (const route of staticRoutes) {
    const card = cardFor(route)
    const image = imageFor(route)
    const meta = metaWithImage(route)

    if (image) {
      assert.equal(image.path, `/${fileFor(route, card)}`)
      assert.ok(existsSync(`${PUBLIC}${image.path.slice(1)}`))
      assert.equal(meta.image, `${SITE_URL}${image.path}`)
      assert.ok(meta.imageAlt.includes(card.title))
    } else {
      assert.equal(meta.image, metaFor(route).image)
      assert.equal(meta.imageAlt, undefined)
    }
    // Everything but the image is the page's own title and description, untouched.
    assert.equal(meta.title, metaFor(route).title)
    assert.equal(meta.description, metaFor(route).description)
  }
  assert.ok(existsSync(`${PUBLIC}og-image.png`), 'the default image is there for every page that needs it')
})
