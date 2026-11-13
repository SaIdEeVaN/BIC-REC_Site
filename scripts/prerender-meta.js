// Runs after `vite build`. Social crawlers don't execute JavaScript, so each route gets its own copy of
// dist/index.html with route-specific title/description/share tags. Firebase serves them via `cleanUrls`
// (/events -> events.html, /events/2 -> events/2.html). There is no catch-all rewrite to index.html: an
// address with no file here is answered with 404.html and a real 404 status (see below).
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { coreTeamMembers, memberPath } from '../src/data/members.js'
import { SITE_URL, metaFor, renderSeoTags, renderStructuredData, staticRoutes, structuredDataFor } from '../src/seo.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

const template = await readFile(join(dist, 'index.html'), 'utf8')
if (!SEO_BLOCK.test(template)) {
  throw new Error('dist/index.html is missing the <!-- seo:start --> … <!-- seo:end --> block from index.html')
}

// The Content-Security-Policy in firebase.json lets an inline script run only if the policy carries that
// script's hash. So editing the inline script in index.html without updating the hash would ship a page whose
// script the browser refuses to run — silently, and only in production. Refuse to build instead, and say
// exactly what to paste. (A browser hashes the script as parsed, with line endings normalised to LF.)
const firebase = JSON.parse(await readFile(new URL('../firebase.json', import.meta.url), 'utf8'))
const policy = firebase.hosting.headers
  .flatMap((rule) => rule.headers)
  .find((header) => header.key === 'Content-Security-Policy').value

for (const [, attributes, body] of template.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/\bsrc=/.test(attributes) || !body.trim()) continue
  const hash = `'sha256-${createHash('sha256').update(body.replace(/\r\n?/g, '\n')).digest('base64')}'`
  if (!policy.includes(hash)) {
    throw new Error(
      `The inline script in index.html has changed, and the Content-Security-Policy in firebase.json would block it.\n` +
        `Replace the 'sha256-…' value in its script-src with:\n\n  ${hash}\n`,
    )
  }
}

// `extra` goes inside the seo block, after the share tags.
const pageFor = (route, extra = []) => {
  const tags = [renderSeoTags(metaFor(route)), ...extra].join('\n    ')
  return template.replace(SEO_BLOCK, () => `<!-- seo:start -->\n    ${tags}\n    <!-- seo:end -->`)
}

const write = async (path, html) => {
  const file = join(dist, path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`)

for (const route of staticRoutes) {
  const data = structuredDataFor(route)
  await write(fileFor(route), pageFor(route, data ? [renderStructuredData(data)] : []))
}

console.log(`prerender-meta: wrote share tags for ${staticRoutes.length} routes`)

// Core members' pages used to live under /team/board. The app sends an old link on to /team/core/<slug>, but it
// can only do that once it has loaded, so each old address still needs a file: the member's real page, whose
// canonical link already names the new address.
for (const member of coreTeamMembers) {
  await write(`team/board/${member.slug}.html`, pageFor(memberPath(member)))
}

// Everything else. Firebase answers an address that has no file with this page and a 404 status, where the old
// catch-all rewrite answered 200 for any address at all — so a mistyped link looked like a real page to search
// engines and link checkers. It is still the app, so the visitor sees the site's own "Block not found" page.
// It carries no canonical link: there is no address this is the page for.
const notFound = pageFor('/404', ['<meta name="robots" content="noindex" />']).replace(/\s*<link rel="canonical"[^>]*>/, '')
await write('404.html', notFound)

console.log(`prerender-meta: wrote ${coreTeamMembers.length} old member addresses and 404.html`)

// The same route list, handed to crawlers. Every route here already has its own prerendered file with a
// canonical link, so the sitemap and the pages agree by construction. No <lastmod>: nothing in the build
// knows when a route's content actually changed, and a made-up date is worse than none.
//
// Routes are built from numeric event ids and [a-z0-9-] member slugs, so no URL here needs XML escaping.
const urls = staticRoutes.map((route) => `  <url><loc>${metaFor(route).url}</loc></url>`).join('\n')

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)

await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

console.log(`prerender-meta: wrote sitemap.xml (${staticRoutes.length} urls) and robots.txt`)
