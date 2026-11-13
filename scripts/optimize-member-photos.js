// Makes every member photo web-sized. Run: npm run photos
//
// Drop a photo into src/assets/members named after the member's slug (.jpg, .jpeg, .png or .webp), then run
// this. Each photo becomes two files, and the one that was dropped in is removed:
//
//   <slug>.webp         the member's own page: at most 800px on its shorter side
//   <slug>-thumb.webp   the roster cells: a 192px square, cropped from the centre as the cells crop it
//
// The roster cells show a face at 56px. They used to load the same 800px JPEG as the member's page, which made
// /team/associates a 6MB page for 47 thumbnails.
//
// Both files are encoded from the pixels alone, so nothing the camera wrote (EXIF, GPS, colour profile)
// survives. Everything in that folder is published, so that is the point as much as the size is.
//
// A photo that already has both files is left alone, so this is safe to run at any time. To replace a
// member's photo, drop the new one in beside the old pair and run it again.
//
// It draws with the browser Playwright already installs for the tests, as `npm run og-image` does, rather than
// adding an image library to every install for something run a few times a year.
import { chromium } from '@playwright/test'
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { facultyCoordinators, memberPages } from '../src/data/members.js'

const dir = fileURLToPath(new URL('../src/assets/members/', import.meta.url))

const FULL = 800
const THUMB = 192
const QUALITY = 0.75
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

const names = await readdir(dir)
const has = new Set(names.map((name) => name.toLowerCase()))
const slugOf = (name) => name.slice(0, -extname(name).length).toLowerCase()

// A dropped-in photo is any image that isn't a thumb and isn't already one half of a finished pair.
// A fresh .jpg beside an old pair is a replacement, and wins.
const sources = names.filter((name) => {
  const ext = extname(name).toLowerCase()
  if (!(ext in TYPES) || slugOf(name).endsWith('-thumb')) return false
  return ext !== '.webp' || !has.has(`${slugOf(name)}-thumb.webp`)
})

if (!sources.length) {
  console.log('photos: nothing to do — every photo already has its web-sized pair')
  process.exit(0)
}

const known = new Set([...memberPages, ...facultyCoordinators].map((member) => member.slug))
const kb = (bytes) => `${Math.round(bytes / 1024)}kB`

const browser = await chromium.launch()
try {
  const page = await browser.newPage()

  for (const name of sources) {
    const slug = slugOf(name)
    const original = await readFile(join(dir, name))

    const made = await page.evaluate(
      async ({ data, type, FULL, THUMB, QUALITY }) => {
        const blob = await (await fetch(`data:${type};base64,${data}`)).blob()
        // Reads the photo the way up it was taken: a phone stores a portrait shot sideways and says so in EXIF.
        const { width, height } = await createImageBitmap(blob, { imageOrientation: 'from-image' })

        const encode = async (bitmap) => {
          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
          canvas.getContext('2d').drawImage(bitmap, 0, 0)
          const out = await canvas.convertToBlob({ type: 'image/webp', quality: QUALITY })
          const bytes = new Uint8Array(await out.arrayBuffer())
          let binary = ''
          for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
          return btoa(binary)
        }

        // Never scaled up: a small photo stays its own size.
        const scale = Math.min(1, FULL / Math.min(width, height))
        const full = await createImageBitmap(blob, {
          imageOrientation: 'from-image',
          resizeWidth: Math.round(width * scale),
          resizeHeight: Math.round(height * scale),
          resizeQuality: 'high',
        })

        const side = Math.min(width, height)
        const thumb = await createImageBitmap(blob, (width - side) / 2, (height - side) / 2, side, side, {
          imageOrientation: 'from-image',
          resizeWidth: Math.min(THUMB, side),
          resizeHeight: Math.min(THUMB, side),
          resizeQuality: 'high',
        })

        return { full: await encode(full), thumb: await encode(thumb), width: full.width, height: full.height }
      },
      { data: original.toString('base64'), type: TYPES[extname(name).toLowerCase()], FULL, THUMB, QUALITY },
    )

    const full = Buffer.from(made.full, 'base64')
    const thumb = Buffer.from(made.thumb, 'base64')
    await writeFile(join(dir, `${slug}.webp`), full)
    await writeFile(join(dir, `${slug}-thumb.webp`), thumb)
    if (name !== `${slug}.webp`) await unlink(join(dir, name))

    console.log(
      `photos: ${name} (${kb(original.length)}) -> ${slug}.webp ${made.width}x${made.height} (${kb(full.length)}) + thumb (${kb(thumb.length)})`,
    )
    if (!known.has(slug)) {
      console.warn(`photos:   no member has the slug "${slug}" — check the file name against src/data/members.js`)
    }
  }
} finally {
  await browser.close()
}
