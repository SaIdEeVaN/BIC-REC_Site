// Runs after `vite build`. Social crawlers don't execute JavaScript, so each route gets its own copy of
// dist/index.html with route-specific title/description/share tags. Firebase serves them via `cleanUrls`
// (/events -> events.html, /events/2 -> events/2.html); anything else still falls back to index.html.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { metaFor, renderSeoTags, staticRoutes } from '../src/seo.js'

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
