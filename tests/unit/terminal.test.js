// The commands behind /terminal (src/lib/terminal.js): what each prints, and where it says to go.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { events } from '../../src/data/events.js'
import { albums, albumPath } from '../../src/data/gallery.js'
import { memberPages, memberPath } from '../../src/data/members.js'
import { blocks, head, short } from '../../src/lib/ledger.js'
import { staticRoutes } from '../../src/seo.js'
import { MAX_ZEROS, PAGES, complete, execute, findMembers, resolve } from '../../src/lib/terminal.js'

// A line as a person reads it, and every link and runnable command in the output.
const text = (lines) => lines.map((segments) => segments.map((s) => (typeof s === 'string' ? s : s.text)).join(''))
const segments = (lines) => lines.flat().filter((s) => typeof s === 'object')
const out = (input, context) => execute(input, context)

test('every command help lists is one the terminal knows', () => {
  // The list is everything above the blank line; below it, a note on the keys.
  const rows = text(out('help').lines)
  const listed = rows.slice(0, rows.indexOf('')).map((row) => row.split(' ')[0])
  assert.ok(listed.length > 10)
  for (const command of listed) {
    assert.doesNotMatch(text(out(command).lines).join('\n'), /command not found/, command)
  }
  assert.match(text(out('nonsense').lines)[0], /command not found: nonsense/)
})

test('everything tappable in help runs, and everything it runs is a command', () => {
  for (const { run } of segments(out('help').lines).filter((s) => s.run)) {
    assert.doesNotMatch(text(out(run).lines).join('\n'), /command not found|error/, run)
  }
})

test('ls events lists every block, oldest first, each linking to its event', () => {
  const { lines } = out('ls events')
  assert.equal(lines.length, events.length)
  lines.forEach((line, i) => {
    assert.ok(text([line])[0].includes(short(blocks[i].hash)))
    assert.deepEqual(segments([line]).find((s) => s.to), { text: events[i].title, to: `/events/${events[i].id}` })
  })
})

test('ls lists the club: every member once across the teams, and every album', () => {
  const linked = ['board', 'core', 'associates'].flatMap((team) => segments(out(`ls ${team}`).lines).filter((s) => s.to).map((s) => s.to))
  assert.deepEqual([...linked].sort(), memberPages.map(memberPath).sort())
  assert.deepEqual(segments(out('ls gallery').lines).filter((s) => s.to).map((s) => s.to), albums.map(albumPath))
  assert.match(text(out('ls nowhere').lines)[0], /no such list/)
})

test("cat prints a block's record exactly as it was hashed, and the hash", () => {
  for (const block of blocks) {
    const printed = text(out(`cat block ${block.height}`).lines).join('\n')
    assert.ok(printed.includes(`previous: ${block.previous}`))
    assert.ok(printed.includes(`title: ${block.record.title}`))
    assert.ok(printed.includes(block.hash))
  }
  assert.equal(text(out('cat 3').lines).join(), text(out('cat block 3').lines).join(), 'the word "block" is optional')
  assert.match(text(out(`cat block ${blocks.length + 1}`).lines)[0], /^error/)
})

test('whois finds someone by any part of their name, and never prints an email', () => {
  for (const member of memberPages) {
    const printed = text(out(`whois ${member.name}`).lines).join('\n')
    assert.ok(printed.includes(member.name), member.name)
    assert.ok(printed.includes(memberPath(member)), `${member.name}'s page`)
    // The site prints a member's address on their own page and nowhere else.
    assert.doesNotMatch(printed, /@/, `${member.name}'s whois`)
  }
  assert.ok(findMembers('RAKSHITHA').length >= 1, 'case does not matter')
  assert.match(text(out('whois zzzz').lines)[0], /no one called/)
})

test('open goes to pages, blocks, members and albums, and says when it cannot', () => {
  for (const [name, path] of Object.entries(PAGES)) {
    assert.equal(resolve(name).path, path)
    assert.ok(staticRoutes.includes(path), `${path} is a real page`)
  }
  assert.equal(resolve('block 3').path, '/events/3')
  assert.equal(resolve('3').path, '/events/3')
  assert.equal(resolve('#0003').path, '/events/3')
  const [someone] = memberPages.filter((m) => findMembers(m.name).length === 1)
  assert.equal(resolve(someone.name).path, memberPath(someone))
  assert.equal(resolve(albums[0].title).path, albumPath(albums[0]))
  assert.ok(resolve('nowhere at all').error)
  assert.equal(out('open chain').navigate, '/chain')
  assert.equal(out('cd events').navigate, '/events', 'cd is open')
})

test('verify re-hashes the chain and finds it whole', () => {
  const printed = text(out('verify').lines)
  assert.equal(printed.filter((row) => row.endsWith('ok')).length, blocks.length)
  assert.ok(printed.some((row) => row.startsWith(`${blocks.length}/${blocks.length} blocks verified`)))
  assert.ok(text(out('head').lines).join('\n').includes(head.hash))
})

test('sha256 hashes exactly what was typed after it', () => {
  assert.deepEqual(text(out('sha256 abc').lines), ['ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'])
  // Case and inner spacing are kept: it hashes "Hello  World", not "hello world".
  assert.notDeepEqual(text(out('sha256 Hello  World').lines), text(out('sha256 hello world').lines))
})

test('mine reads a name and a difficulty, and keeps within what a terminal should wait for', () => {
  assert.deepEqual(out('mine').mine, { name: 'guest', zeros: 4 })
  assert.deepEqual(out('mine Asha K').mine, { name: 'Asha K', zeros: 4 })
  assert.deepEqual(out('mine Asha K 5').mine, { name: 'Asha K', zeros: 5 })
  assert.equal(out(`mine asha ${MAX_ZEROS + 1}`).mine, undefined)
  assert.equal(out('mine asha 0').mine, undefined)
})

test('the side effects are asked for, not done: clear, exit, theme', () => {
  assert.equal(out('clear').clear, true)
  assert.equal(out('exit').navigate, '/')
  assert.equal(out('theme dark').theme, 'dark')
  assert.equal(out('theme purple').theme, undefined)
  assert.match(text(out('theme', { theme: 'dark' }).lines)[0], /the theme is dark/)
  assert.deepEqual(text(out('history', { history: ['ls', 'help'] }).lines).map((row) => row.trim()), ['1  ls', '2  help'])
  assert.deepEqual(out('   ').lines, [])
})

test('tab completes commands, lists and names, and offers the options when it cannot choose', () => {
  assert.deepEqual(complete('hel'), { input: 'help ' })
  assert.deepEqual(complete('he'), { options: ['help', 'head'] })
  assert.deepEqual(complete('ls ev'), { input: 'ls events ' })
  assert.deepEqual(complete('open ch'), { input: 'open chain ' })
  assert.deepEqual(complete('cat bl'), { input: 'cat block ' })
  assert.deepEqual(complete('cat block ').options, blocks.map((block) => String(block.height)))
  assert.deepEqual(complete('theme d'), { input: 'theme dark ' })
  assert.deepEqual(complete('zzz'), {})

  // Names: as far as everyone sharing the start agrees, then the options.
  const first = memberPages[0].name.split(' ')[0].toLowerCase()
  const result = complete(`whois ${first.slice(0, 2)}`)
  assert.ok(result.input?.startsWith(`whois ${first.slice(0, 2)}`) || result.options?.includes(first))
})
