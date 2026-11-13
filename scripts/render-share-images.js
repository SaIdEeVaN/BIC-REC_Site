// Draws the share images: the 1200x630 picture a link to each page previews with.
//
//   npm run share-images   one per page, into public/og (only the ones that are missing)
//   npm run og-image       the default, public/og-image.png, for pages without one of their own
//
// Run share-images after adding or changing an event, an album or a member, and commit what it writes. If it
// isn't run, nothing breaks: a page whose card has changed falls back to the default image (see
// scripts/share-cards.js for how an image is tied to exactly the content it was drawn from).
//
// It draws with the browser Playwright installs for the tests, from scripts/share-card.html.
import { chromium } from '@playwright/test'
import { mkdir, readdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { PUBLIC, TEMPLATE, cardFor, defaultCard, drawable, fileFor } from './share-cards.js'
import { staticRoutes } from '../src/seo.js'

const onlyDefault = process.argv.includes('--default')

// [file under public/, card] for everything to be drawn.
const wanted = onlyDefault
  ? [['og-image.png', defaultCard]]
  : staticRoutes.flatMap((route) => {
      const card = cardFor(route)
      return card ? [[fileFor(route, card), card]] : []
    })

const missing = wanted.filter(([file]) => onlyDefault || !existsSync(`${PUBLIC}${file}`))

// Images whose page has changed or gone: no page points at them any more.
const current = new Set(wanted.map(([file]) => file.replace(/^og\//, '')))
const stale = onlyDefault || !existsSync(`${PUBLIC}og`) ? [] : (await readdir(`${PUBLIC}og`)).filter((name) => !current.has(name))

if (missing.length) {
  await mkdir(`${PUBLIC}og`, { recursive: true })
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
    await page.goto(pathToFileURL(TEMPLATE).href)

    for (const [file, card] of missing) {
      await page.evaluate((drawn) => window.draw(drawn), drawable(card))
      await page.screenshot({
        path: `${PUBLIC}${file}`,
        ...(file.endsWith('.jpg') ? { type: 'jpeg', quality: 78 } : { type: 'png' }),
      })
      console.log(`share-images: drew ${file}`)
    }
  } finally {
    await browser.close()
  }
}

for (const name of stale) {
  await unlink(`${PUBLIC}og/${name}`)
  console.log(`share-images: removed og/${name} (no page uses it any more)`)
}

console.log(
  onlyDefault
    ? 'share-images: drew the default image'
    : `share-images: ${wanted.length} pages have their own image (${missing.length} drawn now, ${stale.length} old ones removed)`,
)
