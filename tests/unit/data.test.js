// The site is its data files: adding an event, an album or a member is an edit to src/data, and nothing else
// checks that edit until a page renders wrongly. These are the mistakes such an edit can make.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { events } from '../../src/data/events.js'
import { albums } from '../../src/data/gallery.js'
import { memberPages, memberPath } from '../../src/data/members.js'
import { DOMAINS } from '../../src/data/domains.js'
import { associates } from '../../src/data/associates.js'
import { resources } from '../../src/data/resources.js'
import { metaFor, staticRoutes } from '../../src/seo.js'

const duplicates = (values) => [...new Set(values.filter((value, i) => values.indexOf(value) !== i))]

test('every member has an address of their own', () => {
  const slugs = memberPages.map((member) => member.slug)
  assert.deepEqual(duplicates(slugs), [], 'two members share a slug, so one of them has no page and no photo')
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `"${slug}" is not a usable address`)
  assert.deepEqual(duplicates(memberPages.map(memberPath)), [])
})

test('every associate belongs to a domain the club has', () => {
  for (const associate of associates) {
    assert.ok(DOMAINS.includes(associate.team), `${associate.name} is in "${associate.team}", which is not a domain`)
  }
})

test("a member's links are real profile links", () => {
  for (const member of memberPages) {
    if (member.linkedin) assert.match(member.linkedin, /^https:\/\/([a-z]+\.)?linkedin\.com\//, `${member.name}'s LinkedIn`)
    if (member.instagram) assert.match(member.instagram, /^https:\/\/(www\.)?instagram\.com\//, `${member.name}'s Instagram`)
  }
})

test('an event that names an album names one that exists, and no two events share one', () => {
  const slugs = new Set(albums.map((album) => album.slug))
  const named = events.filter((event) => event.album).map((event) => event.album)
  for (const album of named) assert.ok(slugs.has(album), `no album "${album}" in data/gallery.js`)
  assert.deepEqual(duplicates(named), [])
  assert.deepEqual(duplicates(albums.map((album) => album.slug)), [])
})

test('every photo has alt text and a caption, numbered 1 to n within its album', () => {
  for (const album of albums) {
    assert.deepEqual(album.photos.map((photo) => photo.n).sort((a, b) => a - b), album.photos.map((_, i) => i + 1), album.slug)
    for (const photo of album.photos) {
      assert.ok(photo.alt?.trim(), `${album.slug} photo ${photo.n} has no alt text`)
      assert.ok(photo.caption?.trim(), `${album.slug} photo ${photo.n} has no caption`)
    }
  }
})

test('every resource is an https link, listed once', () => {
  const all = Object.values(resources).flat()
  assert.deepEqual(duplicates(all.map((resource) => resource.url)), [])
  for (const resource of all) {
    assert.match(resource.url, /^https:\/\//, resource.title)
    assert.ok(resource.title && resource.type && resource.description, `${resource.url} is missing a field`)
  }
})

test('every page has its own title, and a description that says something', () => {
  const titles = staticRoutes.map((route) => metaFor(route).title)
  assert.deepEqual(duplicates(titles), [], 'two pages share a title')
  for (const route of staticRoutes) {
    const { description } = metaFor(route)
    assert.ok(description.length >= 30, `${route}: "${description}" says too little`)
  }
})
