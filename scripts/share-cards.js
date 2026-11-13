// Which share image belongs to which page.
//
// Every page used to preview with the same picture. Now a member's page previews with their name and photo,
// an event's with its title, date and block, an album's with its first photo. The images are drawn by
// `npm run share-images` (scripts/render-share-images.js) and committed under public/og, as the default image
// and the member photos are.
//
// An image is only ever used for the content it was drawn from. Its file name carries a key: a hash of
// everything on the card, the photo's bytes and the template itself. Change a member's role, their photo or
// the template, and the key changes, so the old image no longer matches and the page falls back to the default
// until the images are drawn again. A page can show a generic preview; it can't show a wrong one. It also means
// a changed image gets a new address, which is what makes WhatsApp and LinkedIn fetch it again.
//
// Node only: it reads files. Used by the renderer, by scripts/prerender-meta.js and by the tests.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { events, getEventById, isUpcoming } from '../src/data/events.js'
import { getAlbumBySlug } from '../src/data/gallery.js'
import { getMemberBySlug } from '../src/data/members.js'
import { blockNo, sealedDate } from '../src/lib/chain.js'
import { blockOf, blocks, short } from '../src/lib/ledger.js'
import { SITE_URL, metaFor } from '../src/seo.js'

const root = fileURLToPath(new URL('../', import.meta.url))
export const PUBLIC = `${root}public/`
export const TEMPLATE = `${root}scripts/share-card.html`

const HOST = new URL(SITE_URL).host
const hash = (input) => createHash('sha256').update(input).digest('hex')

// The top of every card: the chain itself, as the site's own ticker has it.
const sealing = (event) => (isUpcoming(event) ? 'pending' : `sealed ${sealedDate(event.date)}`)
const ticker = blocks.slice(0, 4).map(({ event, height, hash }) => `${blockNo(height)} · ${short(hash)} · ${sealing(event)}`)

const CLUB = 'blockchain innovation club · rajalakshmi engineering college'
const TEAM = { board: 'board member', core: 'core member', associates: 'associate member' }

// The default: six blocks, the last one lit, as the site draws the chain when it isn't a particular one.
const RAIL = { nodes: 6, lit: 5 }

const frame = (path) => ({ ticker, rail: RAIL, url: `${HOST}${path === '/' ? '' : path}` })

// The image every page without a card of its own uses (public/og-image.png): the wordmark.
export const defaultCard = {
  layout: 'home',
  ...frame('/'),
  eyebrow: CLUB,
  title: 'BIC/REC',
  body: 'Build. Innovate. Decentralize.',
}

// What a page's card says, or null for a page that uses the default image (the home page does: its card is
// the default). `photo` is a path on disk; the card as drawn is everything else.
export function cardFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return null

  const event = getEventById(path.match(/^\/events\/(\d+)$/)?.[1])
  if (event) {
    return {
      layout: 'text',
      ...frame(path),
      // The rail is this chain: a square per block, and this event's is the lit one.
      rail: { nodes: events.length, lit: events.indexOf(event) },
      // No "upcoming" or "sealed" here, though the page has it: that changes with the calendar, and a card
      // that went out of date on its own the day after the event would drop the page back to the default
      // image exactly when people are sharing it.
      eyebrow: `${blockNo(event.id)} · ${short(blockOf(event).hash)}`,
      title: event.title,
      body: [event.date, event.venue].filter(Boolean).join(' · '),
      chips: [[event.type, true]],
    }
  }

  const album = getAlbumBySlug(path.match(/^\/gallery\/([a-z0-9-]+)$/)?.[1])
  if (album) {
    const first = album.photos.reduce((a, b) => (b.n < a.n ? b : a))
    return {
      layout: 'photo',
      wide: true,
      ...frame(path),
      eyebrow: `gallery · ${album.date}`,
      title: album.title,
      body: `${album.photos.length} ${album.photos.length === 1 ? 'photo' : 'photos'}`,
      photo: `${root}src/assets/gallery/${album.slug}/${String(first.n).padStart(2, '0')}.webp`,
    }
  }

  const [, team, slug] = path.match(/^\/team\/(board|core|associates)\/([a-z0-9-]+)$/) ?? []
  const member = getMemberBySlug(slug)
  if (member && member.team === team) {
    const photo = `${root}src/assets/members/${member.slug}.webp`
    return {
      // A member with no photo yet still gets a card of their own, without the picture.
      layout: existsSync(photo) ? 'photo' : 'text',
      ...frame(path),
      eyebrow: `${TEAM[member.team]} · blockchain innovation club`,
      title: member.name,
      body: [member.role, member.department].filter(Boolean).join(' · '),
      ...(existsSync(photo) && { photo }),
    }
  }

  // Every other page: its title, and its description as the line under it.
  const meta = metaFor(path)
  if (meta.title.startsWith('Block not found')) return null
  return {
    layout: 'text',
    ...frame(path),
    eyebrow: CLUB,
    title: meta.title.replace(/ \| BIC\/REC$/, ''),
    body: meta.description,
    prose: true,
  }
}

const template = () => readFileSync(TEMPLATE)

// Everything that decides what the image looks like, hashed: the card's words, the photo's bytes, the template.
export function keyOf(card) {
  const { photo, ...drawn } = card
  return hash(JSON.stringify(drawn) + (photo ? hash(readFileSync(photo)) : '') + hash(template())).slice(0, 10)
}

// public/og/team-core-arjun-k.3f9a1c2e07.jpg — a photograph compresses as a JPEG, flat colour as a PNG.
export const fileFor = (pathname, card) =>
  `og/${pathname.slice(1).replace(/\//g, '-')}.${keyOf(card)}.${card.photo ? 'jpg' : 'png'}`

// What the renderer hands the template: the same card, with the photo as an address a browser can open.
export const drawable = (card) => (card.photo ? { ...card, photo: pathToFileURL(card.photo).href } : card)

// The page's own image, if one has been drawn for the card as it stands today. Null otherwise.
export function imageFor(pathname) {
  const card = cardFor(pathname)
  if (!card) return null
  const file = fileFor(pathname, card)
  if (!existsSync(`${PUBLIC}${file}`)) return null
  // What the picture shows, for whoever can't see it: the title, and the line under it when that is a fact
  // (a date and venue, a role) rather than the page's description, which the preview prints anyway.
  return { path: `/${file}`, alt: `${card.title}${card.prose ? '' : `, ${card.body}`} — BIC/REC` }
}

// A page's title, description and share tags, with its own image where it has one. This is what gets written
// into the page's HTML at build time; src/seo.js alone only knows the default image, because it also runs in
// the browser, which can't look at the disk.
export function metaWithImage(pathname) {
  const meta = metaFor(pathname)
  const image = imageFor(pathname)
  return image ? { ...meta, image: `${SITE_URL}${image.path}`, imageAlt: image.alt } : meta
}

