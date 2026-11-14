// The commands behind /terminal: the site, read by typing.
//
// Everything here is a function of the input and the club's data, so it runs the same in the browser and in the
// unit tests (tests/unit/terminal.test.js). The page (pages/Terminal.jsx) owns everything with a side effect:
// moving to another page, switching the theme, starting the miner, clearing the screen. A command asks for those
// in what it returns, and the page carries them out.
//
// Output is a list of lines, and a line is a list of segments:
//   'text'                      plain text
//   { text, to }                a link to a page on the site
//   { text, href }              a link off the site (opens in a new tab)
//   { text, run }               a command, which runs when tapped: the way in for anyone without a keyboard
//   { text, tone: 'accent' }    amber, for the prompt, headings and errors
//
// Nothing a command prints may be more than the site already shows: no member's email here (the site prints one
// only on that member's own page), and nothing invented.
import { isUpcoming } from '../data/events.js'
import { albumPath, albums } from '../data/gallery.js'
import { associateGroups, boardGroups, coreGroups, memberPages, memberPath } from '../data/members.js'
import { resources } from '../data/resources.js'
import { CLUB_EMAIL, CLUB_INSTAGRAM, CLUB_LINKEDIN } from '../data/club.js'
import { blockNo, hostOf, sealedDate } from './chain.js'
import { blocks, head, minerName, nextHeight, preimage, recompute, short } from './ledger.js'
import { sha256 } from './sha256.js'

export const USER = 'guest'
export const HOST = 'bicrec'
export const PROMPT = `${USER}@${HOST}:~$`

// Pages `open` can go to, by the name a visitor would type.
export const PAGES = {
  home: '/',
  about: '/about',
  events: '/events',
  gallery: '/gallery',
  team: '/team',
  board: '/team/board',
  core: '/team/core',
  associates: '/team/associates',
  projects: '/projects',
  achievements: '/achievements',
  resources: '/resources',
  contact: '/contact',
  chain: '/chain',
  mine: '/mine',
  terminal: '/terminal',
}

// What `ls` lists. Pages that aren't lists open instead.
const LISTINGS = ['events', 'team', 'board', 'core', 'associates', 'gallery', 'resources']

// Mining here is capped lower than on /mine: six zeros is already 16 million tries, and a terminal that sits
// silent for a minute reads as a terminal that has hung.
export const MAX_ZEROS = 6
const DEFAULT_ZEROS = 4

const line = (...segments) => segments
const accent = (text) => ({ text, tone: 'accent' })
const run = (command, text = command) => ({ text, run: command })
const error = (...segments) => line(accent('error · '), ...segments)

const pad = (text, width) => String(text).padEnd(width)
const status = (event) => (isUpcoming(event) ? 'pending' : 'sealed ')

// "Rakshitha R" and "rakshitha r" are the same person, and so is "rakshitha" when no one else is called that.
const words = (text) => text.toLowerCase().split(/[\s-]+/).filter(Boolean)

export function findMembers(query) {
  const asked = words(query)
  if (!asked.length) return []
  const exact = memberPages.filter((member) => words(member.name).join(' ') === asked.join(' ') || member.slug === asked.join('-'))
  if (exact.length) return exact
  // Every word typed is the start of some word of their name: "madhu n", "sai deevan", "kumar".
  return memberPages.filter((member) => {
    const name = words(member.name)
    return asked.every((word) => name.some((part) => part.startsWith(word)))
  })
}

const findAlbum = (query) => {
  const asked = words(query)
  const matches = albums.filter((album) => {
    const title = words(album.title)
    return asked.every((word) => title.some((part) => part.startsWith(word)) || album.slug.includes(word))
  })
  return matches.length === 1 ? matches[0] : null
}

// "3", "#3", "#0003", "block 3", "event 3": a block, by its height.
const blockAt = (text) => {
  const height = Number(String(text).replace(/^#/, ''))
  return Number.isInteger(height) ? blocks.find((block) => block.height === height) ?? null : null
}

const HELP = [
  ['help', 'this list'],
  ['ls [what]', 'list: events, team, board, core, associates, gallery, resources'],
  ['cat block <n>', 'a block’s record, byte for byte, and its hash'],
  ['whois <name>', 'someone in the club'],
  ['open <page>', 'go to a page: chain, mine, events, block 3, a member…'],
  ['verify', 'hash every block again and check the chain'],
  ['head', 'the latest block'],
  ['sha256 <text>', 'hash anything'],
  ['mine [name] [zeros]', `proof of work, right here (1–${MAX_ZEROS} zeros, ${DEFAULT_ZEROS} if you don’t say)`],
  ['about', 'the club in a sentence'],
  ['contact', 'how to reach the club'],
  ['history', 'what you’ve typed'],
  ['theme dark|light', 'switch the site’s colours'],
  ['clear', 'clear the screen (ctrl+l)'],
  ['exit', 'back to the home page'],
]

// Commands that do something with no arguments are tappable in the help.
const RUNNABLE = new Set(['help', 'ls [what]', 'verify', 'head', 'about', 'contact', 'history', 'clear', 'mine [name] [zeros]'])

function help() {
  const width = Math.max(...HELP.map(([usage]) => usage.length)) + 2
  return [
    ...HELP.map(([usage, what]) => {
      const name = usage.split(' ')[0]
      // The padding that lines the descriptions up sits outside the button, so it isn't underlined with it.
      const gap = ' '.repeat(width - usage.length)
      return RUNNABLE.has(usage) ? line(run(name, usage), gap, what) : line(usage, gap, what)
    }),
    [],
    line('tab completes a command or a name. ↑ and ↓ step through what you’ve typed. ctrl+c stops the miner.'),
    line('with the line empty, tab moves on to the rest of the page.'),
  ]
}

function list(what = '') {
  const target = what.toLowerCase()

  if (!target) {
    return [
      line(
        ...LISTINGS.filter((name) => !['board', 'core', 'associates'].includes(name)).flatMap((name) => [run(`ls ${name}`, `${name}/`), '  ']),
        run('open chain', 'chain'),
        '  ',
        run('open mine', 'mine'),
      ),
    ]
  }

  if (target === 'events') {
    return blocks.map(({ event, height, hash }) =>
      line(`${blockNo(height).replace('block ', '')}  ${sealedDate(event.date)}  ${status(event)}  ${short(hash)}  `, {
        text: event.title,
        to: `/events/${event.id}`,
      }),
    )
  }

  if (target === 'team') {
    return [
      ['board', boardGroups],
      ['core', coreGroups],
      ['associates', associateGroups],
    ].map(([name, groups]) => {
      const size = groups.reduce((total, group) => total + group.members.length, 0)
      return line(run(`ls ${name}`, `${name}/`), ' '.repeat(13 - name.length - 1), `${size} members`)
    })
  }

  const groups = { board: boardGroups, core: coreGroups, associates: associateGroups }[target.split(' ')[0]]
  if (groups) {
    // `ls associates event` lists one domain.
    const domain = target.split(' ').slice(1).join(' ')
    const shown = domain ? groups.filter((group) => group.title.toLowerCase().startsWith(domain)) : groups
    if (!shown.length) return [error(`no domain called "${domain}". `, run('ls associates'), ' lists them all')]
    return shown.flatMap((group, i) => [
      ...(i ? [[]] : []),
      line(accent(`${group.title.toLowerCase()} (${group.members.length})`)),
      ...group.members.map((member) => line('  ', { text: member.name, to: memberPath(member) }, member.role ? ` · ${member.role}` : '')),
    ])
  }

  if (target === 'gallery') {
    return albums.map((album) =>
      line(`${sealedDate(album.date)}  ${pad(`${album.photos.length} photos`, 10)}  `, { text: album.title, to: albumPath(album) }),
    )
  }

  if (target === 'resources') {
    return Object.entries(resources).flatMap(([track, items], i) => [
      ...(i ? [[]] : []),
      line(accent(track.toLowerCase())),
      ...items.map((item) => line(`  ${pad(item.type.toLowerCase(), 12)}`, { text: item.title, href: item.url }, ` · ${hostOf(item.url)}`)),
    ])
  }

  if (PAGES[target]) return [line(`${target} is a page, not a list. `, run(`open ${target}`))]
  return [error(`ls: no such list "${what}". `, run('ls'), ' shows what there is')]
}

function cat(args) {
  const [kind, ...rest] = args
  const block = blockAt(['block', 'event'].includes(kind?.toLowerCase()) ? rest[0] : kind)
  if (!block) return [error('cat block <n>: which block? there are ', run('ls events', `${blocks.length}`), '')]

  return [
    line(accent(`${blockNo(block.height)} · ${isUpcoming(block.event) ? 'pending' : `sealed ${sealedDate(block.event.date)}`}`)),
    ...preimage(block.height, block.previous, block.record).split('\n').map((text) => line(text)),
    [],
    line('sha-256  ', block.hash),
    line({ text: 'the event', to: `/events/${block.event.id}` }, '  ', { text: 'this block on the chain', to: `/chain#block-${block.height}` }),
  ]
}

function whois(query) {
  if (!query.trim()) return [error('whois <name>: whose? try ', run(`whois ${words(memberPages[0].name)[0]}`))]
  const found = findMembers(query)
  if (!found.length) return [error(`no one called "${query}" in the club. `, run('ls team'), ' lists everyone')]
  if (found.length > 1) {
    return [
      line(`${found.length} people match "${query}":`),
      ...found.map((member) => line('  ', run(`whois ${member.name}`, member.name), member.role ? ` · ${member.role}` : '')),
    ]
  }

  const [member] = found
  return [
    line(accent(member.name)),
    line(pad('role', 12), member.role ?? '—'),
    line(pad('team', 12), member.team === 'associates' ? `associates · ${member.group}` : `${member.team} · ${member.group}`),
    ...(member.department ? [line(pad('department', 12), member.department)] : []),
    ...(member.linkedin ? [line(pad('linkedin', 12), { text: member.linkedin.replace(/^https:\/\/(www\.)?/, ''), href: member.linkedin })] : []),
    ...(member.instagram ? [line(pad('instagram', 12), { text: member.instagram.replace(/^https:\/\/(www\.)?/, ''), href: member.instagram })] : []),
    line(pad('page', 12), { text: memberPath(member), to: memberPath(member) }),
  ]
}

// Where `open` goes, or a reason it can't.
export function resolve(target) {
  const asked = target.trim().toLowerCase()
  if (!asked) return { error: 'open <page>: where to? try open chain, open block 3, or a member’s name' }
  if (PAGES[asked]) return { path: PAGES[asked] }

  const [kind, rest] = asked.split(/\s+(.*)/)
  const block = blockAt(['block', 'event'].includes(kind) ? rest : asked)
  if (block) return { path: `/events/${block.event.id}` }

  const members = findMembers(asked)
  if (members.length === 1) return { path: memberPath(members[0]) }
  const album = findAlbum(asked)
  if (album) return { path: albumPath(album) }
  if (members.length > 1) return { error: `"${target}" could be ${members.length} people. whois ${target} lists them` }
  return { error: `open: nothing called "${target}". try ls` }
}

function verify() {
  const started = globalThis.performance?.now() ?? 0
  const results = recompute(blocks.map((block) => block.record))
  const ms = (globalThis.performance?.now() ?? 0) - started
  const intact = results.filter((result) => result.intact).length

  return [
    ...results.map((result) =>
      line(`${blockNo(result.height).replace('block ', '')}  ${short(result.previous)} → ${short(result.hash)}  `, result.intact ? 'ok' : accent('BROKEN')),
    ),
    [],
    line(
      accent(`${intact}/${results.length} blocks verified`),
      ` in ${Math.max(1, Math.round(ms))} ms, by this browser. tamper with one on `,
      { text: '/chain', to: '/chain' },
    ),
  ]
}

const CLUB = 'The Blockchain Innovation Club is a student community at Rajalakshmi Engineering College for blockchain, Web3 and the technology around them, founded in August 2025.'

const COMMANDS = {
  help,
  ls: (args) => list(args.join(' ')),
  dir: (args) => list(args.join(' ')),
  cat,
  whois: (args) => whois(args.join(' ')),
  finger: (args) => whois(args.join(' ')),
  verify,
  head: () => [
    line(accent(`${blockNo(head.height)} · ${head.event.title}`)),
    line(head.hash),
    line({ text: 'the event', to: `/events/${head.event.id}` }, '  ', run(`cat block ${head.height}`, 'read the block')),
  ],
  sha256: (_, raw) => (raw ? [line(sha256(raw))] : [error('sha256 <text>: hash what? try ', run('sha256 hello'))]),
  about: () => [line(CLUB), line({ text: 'more on the about page', to: '/about' })],
  contact: () => [
    line(pad('email', 12), { text: CLUB_EMAIL, href: `mailto:${CLUB_EMAIL}` }),
    line(pad('instagram', 12), { text: '@bic.rec', href: CLUB_INSTAGRAM }),
    line(pad('linkedin', 12), { text: 'blockchain innovation club', href: CLUB_LINKEDIN }),
    line(pad('or write', 12), { text: '/contact', to: '/contact' }),
  ],
  whoami: () => [line(USER)],
  echo: (_, raw) => [line(raw)],
  pwd: () => [line('/home/guest')],
  sudo: () => [line(`${USER} is not in the sudoers file. This incident will be reported.`)],
  // Not in the help: the one thing a chain never does.
  rm: () => [line('this chain is append-only. nothing gets removed, only added on top.')],
}

const ALIASES = { cd: 'open', clear: 'clear', cls: 'clear', man: 'help', '?': 'help', quit: 'exit', logout: 'exit' }

// Runs one line of input. `context` is what only the page knows: what has been typed, and the current theme.
// Returns { lines } and, where the command asks for one, a single side effect: clear, navigate, theme or mine.
export function execute(input, { history = [], theme = 'light' } = {}) {
  const typed = input.trim()
  if (!typed) return { lines: [] }

  const [first, ...args] = typed.split(/\s+/)
  const command = ALIASES[first.toLowerCase()] ?? first.toLowerCase()
  // What follows the command exactly as typed, for the commands that take free text.
  const raw = typed.slice(first.length).trim()

  if (command === 'clear') return { lines: [], clear: true }
  if (command === 'exit') return { lines: [line('bye.')], navigate: '/' }
  if (command === 'history') return { lines: history.map((entry, i) => line(`${String(i + 1).padStart(4)}  `, run(entry))) }

  if (command === 'open') {
    const { path, error: why } = resolve(raw)
    return why ? { lines: [error(why)] } : { lines: [line(`opening ${path}`)], navigate: path }
  }

  if (command === 'theme') {
    const wanted = args[0]?.toLowerCase()
    if (!wanted) return { lines: [line(`the theme is ${theme}. `, run(`theme ${theme === 'dark' ? 'light' : 'dark'}`))] }
    if (!['dark', 'light'].includes(wanted)) return { lines: [error('theme dark or theme light')] }
    return { lines: [line(`theme: ${wanted}`)], theme: wanted }
  }

  if (command === 'mine') {
    // `mine`, `mine asha`, `mine asha k 5`: a last word that is a number is the difficulty.
    const numbered = /^\d+$/.test(args.at(-1) ?? '')
    const zeros = numbered ? Number(args.at(-1)) : DEFAULT_ZEROS
    const name = minerName((numbered ? args.slice(0, -1) : args).join(' ') || USER)
    if (zeros < 1 || zeros > MAX_ZEROS) {
      return { lines: [error(`mine: 1 to ${MAX_ZEROS} zeros here. more than that is on `, { text: '/mine', to: '/mine' })] }
    }
    return {
      lines: [line(`mining ${blockNo(nextHeight)} for ${name} on top of ${short(head.hash)}, until its hash starts with ${zeros} zeros`)],
      mine: { name, zeros },
    }
  }

  const handler = COMMANDS[command]
  if (handler) return { lines: handler(args, raw) }
  return { lines: [error(`command not found: ${first}. `, run('help'), ' lists what there is')] }
}

// ---- tab completion ----

const COMMAND_NAMES = ['help', 'ls', 'cat', 'whois', 'open', 'verify', 'head', 'sha256', 'mine', 'about', 'contact', 'history', 'theme', 'clear', 'exit']

const firstNames = () => [...new Set(memberPages.map((member) => words(member.name)[0]))].sort()

function candidatesFor(command, before) {
  if (command === 'ls') {
    if (before[0]?.toLowerCase() === 'associates') return associateGroups.map((group) => group.title.toLowerCase().split(' ')[0])
    return before.length ? [] : LISTINGS
  }
  if (command === 'cat') return before.length ? blocks.map((block) => String(block.height)) : ['block']
  if (command === 'open' || command === 'cd') return before.length ? [] : [...Object.keys(PAGES), 'block', ...firstNames()]
  if (command === 'whois') return before.length ? [] : firstNames()
  if (command === 'theme') return before.length ? [] : ['dark', 'light']
  return []
}

const commonPrefix = (strings) =>
  strings.reduce((prefix, text) => {
    let i = 0
    while (i < prefix.length && prefix[i] === text[i]) i++
    return prefix.slice(0, i)
  })

// Completes the word being typed. Returns { input } with the line as completed, or { options } when the word could
// still become more than one thing (and nothing more can be filled in), or {} when there is nothing to offer.
export function complete(input) {
  const parts = input.split(/\s+/)
  const word = parts.at(-1)
  const before = parts.slice(0, -1).filter(Boolean)

  const candidates = before.length ? candidatesFor(before[0].toLowerCase(), before.slice(1)) : COMMAND_NAMES
  const matches = candidates.filter((candidate) => candidate.startsWith(word.toLowerCase()))
  if (!matches.length) return {}

  const stem = input.slice(0, input.length - word.length)
  if (matches.length === 1) return { input: `${stem}${matches[0]} ` }

  const shared = commonPrefix(matches)
  if (shared.length > word.length) return { input: `${stem}${shared}` }
  return { options: matches }
}
