// Runs after `vite build`. Social crawlers don't execute JavaScript, so each route gets its own copy of
// dist/index.html with route-specific title/description/share tags. Firebase serves them via `cleanUrls`
// (/events -> events.html, /events/2 -> events/2.html); anything else still falls back to index.html.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, metaFor, renderSeoTags, staticRoutes } from '../src/seo.js'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

const template = await readFile(join(dist, 'index.html'), 'utf8')
if (!SEO_BLOCK.test(template)) {
  throw new Error('dist/index.html is missing the <!-- seo:start --> … <!-- seo:end --> block from index.html')
}

for (const route of staticRoutes) {
  const tags = renderSeoTags(metaFor(route))
  const html = template.replace(SEO_BLOCK, () => `<!-- seo:start -->\n    ${tags}\n    <!-- seo:end -->`)
  const file = join(dist, route === '/' ? 'index.html' : `${route.slice(1)}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

console.log(`prerender-meta: wrote share tags for ${staticRoutes.length} routes`)

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

// Firebase serves a file that exists before it applies the catch-all rewrite, so both of these are
// reachable at the root rather than being swallowed by the SPA fallback.
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

console.log(`prerender-meta: wrote sitemap.xml (${staticRoutes.length} urls) and robots.txt`)
