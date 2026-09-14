// Renders scripts/og-image.html to public/og-image.png (1200x630). Run: npm run og-image
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const source = new URL('./og-image.html', import.meta.url)
const output = fileURLToPath(new URL('../public/og-image.png', import.meta.url))

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(source.href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: output })
  console.log(`og-image: wrote ${output}`)
} finally {
  await browser.close()
}
