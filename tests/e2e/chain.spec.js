import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { events } from '../../src/data/events.js'
import { blockNo } from '../../src/lib/chain.js'
import { blockOf, blocks, minerName, miningPrefix, short } from '../../src/lib/ledger.js'
import { createMiner, hexOf, meetsDifficulty } from '../../src/lib/sha256.js'
import { watchPolicy } from './policy.js'

// /chain and /mine: the two pages where the site's blockchain vocabulary is the real thing. What matters about
// them is that it *is* real — the browser's own SHA-256 agrees with every hash, a changed record breaks exactly
// the blocks it should, and a mined block hashes to what the page says it does.

// Behaviour is identical at every width, so these run once. (Both pages' layouts are measured at every width,
// and scanned for accessibility, with the rest of the routes in pages.spec.js and a11y.spec.js.)
const once = (testInfo) => test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')

const chips = (page) => page.locator('main ol > li .chip')
const verdict = (page) => page.locator('main [role="status"]')

async function verify(page) {
  await page.getByRole('button', { name: /Verify (the chain|again)/ }).click()
  await expect(verdict(page).getByRole('heading')).not.toHaveText(/Checking|Not checked/)
}

test("the chain verifies: the browser's own SHA-256 agrees with the hash every block was sealed with", async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/chain')
  await expect(chips(page)).toHaveText(blocks.map(() => 'Unchecked'))

  await verify(page)
  await expect(verdict(page).getByRole('heading')).toHaveText(`All ${blocks.length} blocks verified`)
  // Not the site's implementation marking its own homework: crypto.subtle did the hashing, and it agreed.
  await expect(verdict(page)).toContainText('your browser’s own SHA-256')
  await expect(chips(page)).toHaveText(blocks.map(() => 'Verified'))
})

test('changing one record breaks that block and every block after it, and none before it', async ({ page }, testInfo) => {
  once(testInfo)
  // A block from the middle, so there are blocks on both sides of it to hold and to break.
  const at = Math.floor(blocks.length / 2)
  const block = blocks[at]

  await page.goto('/chain')
  await verify(page)
  await page.getByRole('button', { name: `open the block ${blockNo(block.height)}` }).click()
  await page.getByLabel('title').fill(`${block.record.title}.`)

  await expect(chips(page)).toHaveText(blocks.map((_, i) => (i < at ? 'Verified' : i === at ? 'Altered' : 'Broken')))
  await expect(verdict(page).getByRole('heading')).toHaveText(`Broken at ${blockNo(block.height)}`)
  // The block still says what it was sealed as, beside the hash its record gives now.
  const card = page.locator(`#block-${block.height}`)
  await expect(card).toContainText(block.hash)
  await expect(card.locator('pre')).toContainText(`title: ${block.record.title}.`)

  await page.getByRole('button', { name: 'Put it back' }).click()
  await expect(chips(page)).toHaveText(blocks.map(() => 'Verified'))
  await expect(page.getByLabel('title')).toHaveValue(block.record.title)
})

test('a record changed before anyone verified is caught by the verification', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/chain')
  await page.getByRole('button', { name: `open the block ${blockNo(blocks[0].height)}` }).click()
  await page.getByLabel('date').fill('September 19, 2025')
  // Nothing has been checked, so nothing is claimed yet.
  await expect(chips(page)).toHaveText(blocks.map(() => 'Unchecked'))

  await verify(page)
  await expect(verdict(page).getByRole('heading')).toHaveText(`Broken at ${blockNo(blocks[0].height)}`)
  await expect(chips(page)).toHaveText(blocks.map((_, i) => (i === 0 ? 'Altered' : 'Broken')))
})

test("an event shows its block's real hash, and leads to that block opened on the chain", async ({ page }, testInfo) => {
  once(testInfo)
  const event = events.at(-1)
  const block = blockOf(event)

  await page.goto('/events')
  await expect(page.locator(`main a[href="/events/${event.id}"]`)).toContainText(short(block.hash))

  await page.goto(`/events/${event.id}`)
  await expect(page.locator('main header')).toContainText(short(block.hash))
  await page.getByRole('link', { name: 'verify this block' }).click()

  await expect(page).toHaveURL(`/chain#block-${block.height}`)
  const card = page.locator(`#block-${block.height}`)
  await expect(card.getByRole('button', { name: /close the block/ })).toBeVisible()
  await expect(card).toContainText(block.hash)
  await expect(card).toBeInViewport()
})

// What the miner must find, worked out here the slow and obvious way: try every nonce from 0.
function firstBlock(name, zeros) {
  const prefix = miningPrefix(minerName(name))
  const tryNonce = createMiner(prefix)
  for (let nonce = 0; ; nonce++) {
    const H = tryNonce(nonce)
    if (meetsDifficulty(H, zeros)) return { nonce, hash: hexOf(H), record: `${prefix}${nonce}` }
  }
}

const found = (page) => page.locator('main [role="status"]')

test('mining finds the first nonce that works, and the block it shows hashes to what it says', async ({ page }, testInfo) => {
  once(testInfo)
  const blocked = watchPolicy(page)
  const three = firstBlock('Asha', 3)
  const four = firstBlock('Asha', 4)

  await page.goto('/mine')
  await page.getByLabel('your name, or anything you like').fill('Asha')
  await page.getByRole('button', { name: '3', exact: true }).click()
  await page.getByRole('button', { name: 'Start mining' }).click()

  await expect(found(page).getByRole('heading')).toHaveText('Block found')
  await expect(found(page)).toContainText(three.hash)
  await expect(found(page)).toContainText(`Nonce ${three.nonce.toLocaleString('en-US')} is the first that works`)
  await expect(page.locator('main pre')).toHaveText(three.record)
  // And a second opinion on the finished block, from the browser's own SHA-256.
  await expect(found(page)).toContainText('confirmed by your browser’s own sha-256')

  // One more zero, same name: a different, harder answer.
  await page.getByRole('button', { name: 'Add a zero' }).click()
  await expect(found(page)).toContainText(four.hash)
  await expect(page.locator('main pre')).toHaveText(four.record)

  // The miner runs in a worker, which the Content-Security-Policy has to allow.
  expect(blocked, 'the miner loads something the Content-Security-Policy blocks').toEqual([])
})

test("anyone can check a block from its miner's name and nonce, and a wrong nonce shows for what it is", async ({ page }, testInfo) => {
  once(testInfo)
  const block = firstBlock('Asha', 3)
  const zerosOf = (hash) => hash.match(/^0*/)[0].length
  const result = page.locator('main [data-check-result]')

  await page.goto('/mine')
  await page.getByLabel('the miner’s name, as they typed it').fill('Asha')
  // Typed the way the page prints it, with a comma.
  await page.getByLabel('their nonce').fill(block.nonce.toLocaleString('en-US'))
  await expect(result).toContainText(block.hash)
  await expect(result).toContainText(`${zerosOf(block.hash)} zeros`)

  // Any other number is just a number: its hash is shown too, with however few zeros it has.
  const other = hexOf(createMiner(miningPrefix(minerName('Asha')))(block.nonce + 1))
  await page.getByLabel('their nonce').fill(String(block.nonce + 1))
  await expect(result).toContainText(other)
  await expect(result).not.toContainText(block.hash)

  await page.getByLabel('their nonce').fill('not a number')
  await expect(result).toContainText('nothing to check yet')
})

test('a search can be stopped, and leaves nothing running or claimed', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/mine')
  // Seven zeros is minutes of work: long enough to still be searching when Stop is pressed.
  await page.getByRole('button', { name: '7', exact: true }).click()
  await page.getByRole('button', { name: 'Start mining' }).click()
  await expect(page.locator('main')).toContainText('mining')
  await page.getByRole('button', { name: 'Stop' }).click()

  await expect(page.getByRole('button', { name: 'Start mining' })).toBeVisible()
  await expect(page.locator('main')).not.toContainText('Block found')
  await expect(page.locator('main .on-ink dl')).toHaveCount(0)
})

// The pages as they are after being used have markup the resting pages don't: status chips, an open record
// with its form, the result of a search, the filled-in table.
const scan = async (page) =>
  (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations.flatMap(
    (violation) => violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`),
  )

for (const theme of ['light', 'dark']) {
  test(`a broken chain with a block open has no accessibility violations a machine can find (${theme})`, async ({ page }, testInfo) => {
    once(testInfo)
    if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('bic-theme', 'dark'))

    await page.goto('/chain')
    await verify(page)
    await page.getByRole('button', { name: `open the block ${blockNo(blocks[1].height)}` }).click()
    await page.getByLabel('venue').fill('Somewhere else')
    await expect(chips(page).nth(1)).toHaveText('Altered')

    expect(await scan(page)).toEqual([])
  })

  test(`a mined block has no accessibility violations a machine can find (${theme})`, async ({ page }, testInfo) => {
    once(testInfo)
    if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('bic-theme', 'dark'))

    await page.goto('/mine')
    await page.getByRole('button', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: 'Start mining' }).click()
    await expect(found(page).getByRole('heading')).toHaveText('Block found')

    expect(await scan(page)).toEqual([])
  })
}
