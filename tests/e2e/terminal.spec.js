import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { events } from '../../src/data/events.js'
import { blocks, minerName, miningPrefix } from '../../src/lib/ledger.js'
import { createMiner, hexOf, meetsDifficulty } from '../../src/lib/sha256.js'
import { watchPolicy } from './policy.js'

// /terminal: the commands themselves are unit-tested (tests/unit/terminal.test.js). These are about the screen —
// typing, the keys a terminal is expected to have, the side effects, and that it works by touch alone.

const once = (testInfo) => test.skip(testInfo.project.name !== 'desktop-1280', 'same behaviour at every width')

const log = (page) => page.getByRole('log', { name: 'Terminal output' })
const line = (page) => page.getByLabel('Command')

async function type(page, command) {
  await line(page).fill(command)
  await line(page).press('Enter')
}

test('typing a command prints its output, with links into the site', async ({ page }, testInfo) => {
  once(testInfo)
  const blocked = watchPolicy(page)

  await page.goto('/terminal')
  await type(page, 'ls events')
  await expect(log(page)).toContainText('guest@bicrec:~$ ls events')
  for (const event of events) await expect(log(page).getByRole('link', { name: event.title })).toHaveAttribute('href', `/events/${event.id}`)

  await type(page, `cat block ${blocks[2].height}`)
  await expect(log(page)).toContainText(blocks[2].hash)

  await log(page).getByRole('link', { name: events.at(-1).title }).click()
  await expect(page).toHaveURL(`/events/${events.at(-1).id}`)
  expect(blocked).toEqual([])
})

test('tab completes, the arrows step back through what was typed, and ctrl+l clears', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/terminal')
  await line(page).fill('ls ev')
  await line(page).press('Tab')
  await expect(line(page)).toHaveValue('ls events ')

  // Two ways the word could go: both are printed, and the line is left as it was.
  await line(page).fill('he')
  await line(page).press('Tab')
  await expect(log(page)).toContainText('help   head')
  await expect(line(page)).toHaveValue('he')

  await type(page, 'head')
  await type(page, 'verify')
  await line(page).press('ArrowUp')
  await expect(line(page)).toHaveValue('verify')
  await line(page).press('ArrowUp')
  await expect(line(page)).toHaveValue('head')
  await line(page).press('ArrowDown')
  await expect(line(page)).toHaveValue('verify')
  await line(page).press('ArrowDown')
  await expect(line(page)).toHaveValue('')

  await line(page).press('Control+l')
  await expect(log(page)).toHaveText('')
})

test('with the line empty, tab leaves the terminal, so a keyboard is never trapped in it', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/terminal')
  await line(page).focus()
  await line(page).press('Tab')
  await expect(line(page)).not.toBeFocused()
})

test('everything works by touch: a command in the output, or one of the starting points, runs when tapped', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/terminal')
  await page.locator('main').getByRole('button', { name: 'ls events', exact: true }).last().click()
  await expect(log(page).getByRole('link', { name: events[0].title })).toBeVisible()

  await type(page, 'ls')
  await log(page).getByRole('button', { name: 'gallery/' }).click()
  await expect(log(page)).toContainText('guest@bicrec:~$ ls gallery')
})

test('mine finds the first nonce that works, and ctrl+c stops a long search', async ({ page }, testInfo) => {
  once(testInfo)
  const prefix = miningPrefix(minerName('asha'))
  const tryNonce = createMiner(prefix)
  let nonce = 0
  while (!meetsDifficulty(tryNonce(nonce), 3)) nonce++
  const hash = hexOf(tryNonce(nonce))

  await page.goto('/terminal')
  await type(page, 'mine asha 3')
  await expect(log(page)).toContainText(`nonce ${nonce.toLocaleString('en-US')}`)
  await expect(log(page)).toContainText(hash)
  await expect(log(page)).toContainText(`nonce: ${nonce}`)

  // Six zeros is about 16 million tries: still running when it is stopped.
  await type(page, 'mine asha 6')
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible()
  await line(page).press('Control+c')
  await expect(log(page)).toContainText(/\^C · stopped after [\d,]+ tries/)
  await expect(page.getByRole('button', { name: 'Stop' })).toHaveCount(0)
})

test('open goes to the page, theme switches the colours, exit goes home', async ({ page }, testInfo) => {
  once(testInfo)

  await page.goto('/terminal')
  await type(page, 'theme dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await type(page, 'theme light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await type(page, 'open chain')
  await expect(page).toHaveURL('/chain')

  await page.goto('/terminal')
  await type(page, 'exit')
  await expect(page).toHaveURL('/')
})

// The resting page is scanned with every other route (a11y.spec.js); this is the page after use, with output of
// every kind on the screen.
for (const theme of ['light', 'dark']) {
  test(`a terminal in use has no accessibility violations a machine can find (${theme})`, async ({ page }, testInfo) => {
    once(testInfo)
    if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('bic-theme', 'dark'))

    await page.goto('/terminal')
    for (const command of ['help', 'ls events', 'whois rakshitha', 'cat block 1', 'contact', 'mine asha 2']) await type(page, command)
    await expect(log(page)).toContainText('found block')

    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    expect(violations.flatMap((v) => v.nodes.map((node) => `${v.id}: ${node.target.join(' ')}`))).toEqual([])
  })
}
