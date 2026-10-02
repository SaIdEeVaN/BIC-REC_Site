// Page titles, descriptions and share tags for every route.
// Used at runtime (RouteMeta in App.jsx), at build time (scripts/prerender-meta.js) and by the e2e tests,
// so keep this file free of browser-only or Vite-only code.
import { events, getEventById } from './data/events.js'
import { FACULTY, getMemberBySlug, memberPath, teamMembers } from './data/members.js'
import { RECRUITMENT_RESULTS_OPEN } from './data/club.js'

export const SITE_URL = 'https://bicrec.web.app'

const DEFAULT_DESCRIPTION =
  'A student-driven community dedicated to exploring Blockchain, Web3, and emerging technologies at Rajalakshmi Engineering College.'

const PAGES = {
  '/': { title: 'Blockchain Innovation Club | REC', description: DEFAULT_DESCRIPTION },
  '/about': {
    title: 'About us',
    description: 'The journey, impact and ethos of the Blockchain Innovation Club at Rajalakshmi Engineering College.',
  },
  '/events': {
    title: 'Events',
    description: 'Every event the Blockchain Innovation Club has run at REC, from its inauguration in September 2025.',
  },
  '/gallery': {
    title: 'Gallery',
    description: "Photos from the club's events, one album at a time — starting with its inauguration in September 2025.",
  },
  '/team': {
    title: 'Meet us',
    description: 'The board, the core team and the associates: meet the people of the Blockchain Innovation Club at REC.',
  },
  '/team/board': {
    title: 'Board members',
    description: `The ${FACULTY} and student board guiding, managing, and growing the Blockchain Innovation Club at REC.`,
  },
  '/team/core': {
    title: 'Core members',
    description: "The leads and co-leads who run the Blockchain Innovation Club's seven domains.",
  },
  '/team/associates': {
    title: 'Associate members',
    description: RECRUITMENT_RESULTS_OPEN
      ? 'The 2026–27 recruitment results are out — check yours with the email you applied with and your roll number.'
      : 'Selections for the 2026–27 intake are being finalised — results will be published here once they are out.',
  },
  '/projects': {
    title: 'Projects',
    description: "The club's first blockchain projects are in progress — each will be published here as it ships.",
  },
  '/achievements': {
    title: 'Achievements',
    description: "A journey of learning, building, and winning — here's what the club has accomplished together.",
  },
  '/news': {
    title: 'News',
    description: 'The latest news, announcements, and achievements from the Blockchain Innovation Club.',
  },
  '/resources': {
    title: 'Resources',
    description: 'Handpicked resources curated by the BIC team to help you master Blockchain and Web3.',
  },
  '/contact': {
    title: 'Contact',
    description: 'For collaborations, events, workshops, and general enquiries — get in touch with the club.',
  },
}

function build(title, description, path) {
  return {
    title: path === '/' ? title : `${title} | BIC/REC`,
    description,
    url: `${SITE_URL}${path}`,
    image: `${SITE_URL}/og-image.png`,
  }
}

export function metaFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'

  const eventMatch = path.match(/^\/events\/(\d+)$/)
  const event = eventMatch && getEventById(eventMatch[1])
  if (event) return build(event.title, event.description, path)

  const memberMatch = path.match(/^\/team\/(board|core)\/([a-z0-9-]+)$/)
  const member = memberMatch && getMemberBySlug(memberMatch[2])
  if (member && member.team === memberMatch[1]) {
    const detail = [member.role, member.department].filter(Boolean).join(' · ')
    return build(member.name, `${detail} — Blockchain Innovation Club, Rajalakshmi Engineering College.`, path)
  }

  const page = PAGES[path]
  if (page) return build(page.title, page.description, path)

  return build('Block not found', DEFAULT_DESCRIPTION, path)
}

// Every route that gets its own prerendered HTML file.
export const staticRoutes = [
  ...Object.keys(PAGES),
  ...events.map((e) => `/events/${e.id}`),
  ...teamMembers.map(memberPath),
]

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderSeoTags(meta) {
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${meta.url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="BIC/REC" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${meta.url}" />`,
    `<meta property="og:image" content="${meta.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="BIC/REC — Blockchain Innovation Club, Rajalakshmi Engineering College" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${meta.image}" />`,
  ].join('\n    ')
}
