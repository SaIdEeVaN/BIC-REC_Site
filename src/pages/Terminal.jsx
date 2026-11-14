import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/kit'
import { AMBER, Slam, useCanAnimate } from '../components/motion'
import ProveIt from '../components/ProveIt'
import { memberPages } from '../data/members'
import { blockNo } from '../lib/chain'
import { head, miningPrefix, nextHeight, short } from '../lib/ledger'
import { PROMPT, complete, execute } from '../lib/terminal'
import { setTheme, useTheme } from '../lib/theme'

// The site, by typing. The commands themselves are lib/terminal.js; this is the screen they print to, the line
// they are typed into, and the side effects they ask for (moving to a page, switching the theme, mining).
//
// For anyone without a keyboard, every command in the output that can simply be run is a button, and a row of
// starting points sits under the screen.

const count = new Intl.NumberFormat('en-US')

const BANNER = [
  [{ text: 'BIC/REC terminal', tone: 'accent' }, ' · blockchain innovation club, rajalakshmi engineering college'],
  [`${blockNo(head.height)} is the head · ${short(head.hash)}`],
  ['type ', { text: 'help', run: 'help' }, ' and press enter, or tap a command below.'],
  [],
]

const firstName = memberPages[0].name.split(' ')[0].toLowerCase()

// Starting points, as buttons: one of each kind of thing the terminal does.
const TRY = ['help', 'ls events', `cat block ${head.height}`, `whois ${firstName}`, 'verify', 'mine guest 4', 'ls team']

function Segment({ segment, onRun }) {
  if (typeof segment === 'string') return segment
  const linkClass = 'underline decoration-2 underline-offset-4 hover:decoration-[3px]'

  if (segment.to) {
    return (
      <Link to={segment.to} className={linkClass}>
        {segment.text}
      </Link>
    )
  }
  if (segment.href) {
    const external = /^https?:/.test(segment.href)
    return (
      <a href={segment.href} className={linkClass} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
        {segment.text}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  if (segment.run) {
    return (
      <button type="button" onClick={() => onRun(segment.run)} className={`${linkClass} whitespace-pre text-amber`}>
        {segment.text}
      </button>
    )
  }
  return <span className={segment.tone === 'accent' ? 'text-amber' : undefined}>{segment.text}</span>
}

export default function Terminal() {
  const navigate = useNavigate()
  const theme = useTheme()
  const canAnimate = useCanAnimate()

  const [lines, setLines] = useState(() => BANNER.map((segments, id) => ({ id, segments })))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  // Where ↑/↓ have got to in the history; null while typing a new line.
  const [cursor, setCursor] = useState(null)
  // The miner, while it runs: the worker and the id of the line it is updating.
  const [mining, setMining] = useState(null)

  const nextId = useRef(BANNER.length)
  const screen = useRef(null)
  const field = useRef(null)
  const worker = useRef(null)

  const make = (segments, extra) => ({ id: nextId.current++, segments, ...extra })
  const print = (...newLines) => setLines((current) => [...current, ...newLines.map((segments) => make(segments))])

  // Every new line scrolls the screen to the bottom, as a terminal does.
  useEffect(() => {
    if (screen.current) screen.current.scrollTop = screen.current.scrollHeight
  }, [lines])

  // On a machine with a keyboard and a mouse the line is ready to type into. Not on a phone, where focusing it
  // would throw the keyboard up over the page before anyone asked for it.
  useEffect(() => {
    if (window.matchMedia?.('(pointer: fine)').matches) field.current?.focus({ preventScroll: true })
  }, [])

  // Leaving the page mid-search must not leave a thread hashing for nobody.
  useEffect(() => () => worker.current?.terminate(), [])

  // Ends a search early. Its progress line becomes `message`, and is read out like any other line.
  const stopMining = (line, message) => {
    worker.current?.terminate()
    worker.current = null
    setMining(null)
    setLines((all) => all.map((entry) => (entry.id === line ? { ...entry, segments: [message], hidden: false } : entry)))
  }

  const mine = ({ name, zeros }) => {
    const prefix = miningPrefix(name)
    const thread = new Worker(new URL('../lib/miner.worker.js', import.meta.url), { type: 'module' })
    worker.current = thread
    // The progress line rewrites itself a dozen times a second: hidden from screen readers, which hear the
    // result as a new line instead of the counter as noise.
    const progress = make([canAnimate ? 'starting…' : 'searching…'], { hidden: true })
    setLines((current) => [...current, progress])
    setMining({ line: progress.id, tries: 0 })

    thread.onmessage = ({ data }) => {
      if (worker.current !== thread) return
      if (!data.found) {
        setMining((current) => current && { ...current, tries: data.tries })
        if (canAnimate) {
          const rate = data.ms > 40 ? ` · ${count.format(Math.round(data.tries / (data.ms / 1000)))} hashes/s` : ''
          setLines((all) =>
            all.map((entry) => (entry.id === progress.id ? { ...entry, segments: [`${count.format(data.tries)} tries${rate} · ${data.hash}`] } : entry)),
          )
        }
        return
      }

      worker.current = null
      thread.terminate()
      setMining(null)
      setLines((all) => [
        ...all.filter((entry) => entry.id !== progress.id),
        make([{ text: `found ${blockNo(nextHeight)}`, tone: 'accent' }, ` · nonce ${count.format(data.nonce)} · ${count.format(data.tries)} tries in ${(data.ms / 1000).toFixed(2)} s`]),
        make([data.hash]),
        make([]),
        make([{ text: 'the block, byte for byte (any sha-256 tool gives the same hash):', tone: 'accent' }]),
        ...`${prefix}${data.nonce}`.split('\n').map((text) => make([`  ${text}`])),
        make([]),
        make(['it stays in this tab: nothing was sent anywhere, or added to the chain.']),
      ])
    }
    thread.onerror = () => stopMining(progress.id, 'the miner couldn’t start in this browser')
    thread.postMessage({ prefix, zeros })
  }

  const submit = (command) => {
    const echo = make([{ text: PROMPT, tone: 'accent' }, ` ${command}`])
    const typed = command.trim()
    const pastHistory = typed ? [...history.filter((entry) => entry !== typed), typed] : history
    setHistory(pastHistory)
    setCursor(null)
    setInput('')

    if (mining) {
      setLines((current) => [...current, echo, make(['the miner is still running. ctrl+c (or stop) ends it.'])])
      return
    }

    const result = execute(command, { history: pastHistory, theme })
    if (result.clear) {
      setLines([])
      return
    }
    setLines((current) => [...current, echo, ...result.lines.map((segments) => make(segments))])

    if (result.theme) setTheme(result.theme)
    if (result.mine) mine(result.mine)
    // A beat, so the "opening …" line is seen before the page changes.
    if (result.navigate) setTimeout(() => navigate(result.navigate), 250)
  }

  const runFromOutput = (command) => {
    submit(command)
    field.current?.focus({ preventScroll: true })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit(input)
      return
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      // Copying selected text still works: ctrl+c only interrupts when nothing is selected.
      if (window.getSelection()?.toString()) return
      e.preventDefault()
      if (mining) stopMining(mining.line, `^C · stopped after ${count.format(mining.tries)} tries`)
      else {
        print([{ text: PROMPT, tone: 'accent' }, ` ${input}^C`])
        setInput('')
      }
      return
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setLines([])
      return
    }

    // With the line empty, tab moves focus on like anywhere else, so the terminal never traps a keyboard.
    if (e.key === 'Tab' && !e.shiftKey && input.trim()) {
      e.preventDefault()
      const result = complete(input)
      if (result.input) setInput(result.input)
      else if (result.options) print([{ text: PROMPT, tone: 'accent' }, ` ${input}`], [result.options.join('   ')])
      return
    }

    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const at = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(at)
      setInput(history[at])
      return
    }

    if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const at = cursor + 1
      if (at >= history.length) {
        setCursor(null)
        setInput('')
      } else {
        setCursor(at)
        setInput(history[at])
      }
    }
  }

  // A click on the screen puts the cursor back on the line, unless it was on a link or a button, or selected text.
  const focusLine = (e) => {
    if (e.target.closest('a, button, input')) return
    if (window.getSelection()?.toString()) return
    field.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="the site, by keyboard"
        title="Terminal"
        lead="Everything on the site, typed: list the events, read a block byte for byte, look someone up, verify the chain, mine a block. Type help to start, or tap a command."
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <Slam color={AMBER} className="on-ink border-3 border-ink bg-ink text-bone shadow-amber">
            <div className="flex items-center justify-between gap-4 border-b-3 border-bone px-4 py-2.5 font-mono text-[12px] md:px-5">
              <span>
                {PROMPT.replace(':~$', '')} · tty1
              </span>
              <span>head {short(head.hash)}</span>
            </div>

            {/* The output is a log: a screen reader hears each new line as it is printed. */}
            <div
              ref={screen}
              onClick={focusLine}
              className="h-[62vh] min-h-[340px] max-h-[640px] overflow-y-auto px-4 py-4 font-mono text-[13.5px] leading-[1.6] md:px-5 md:text-[14px]"
            >
              <div role="log" aria-label="Terminal output">
                {lines.map((entry) => (
                  <div
                    key={entry.id}
                    aria-hidden={entry.hidden || undefined}
                    className="min-h-[1.6em] whitespace-pre-wrap [overflow-wrap:anywhere]"
                  >
                    {entry.segments.map((segment, i) => (
                      <Segment key={i} segment={segment} onRun={runFromOutput} />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2">
                <span aria-hidden="true" className="shrink-0 text-amber">
                  {PROMPT}
                </span>
                <label htmlFor="terminal-line" className="sr-only">
                  Command
                </label>
                {/* 16px on phones: any smaller and iOS zooms the page in on focus. */}
                <input
                  ref={field}
                  id="terminal-line"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setCursor(null)
                  }}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                  enterKeyHint="send"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[16px] text-bone caret-amber outline-none md:text-[14px]"
                />
                {mining && (
                  <button
                    type="button"
                    onClick={() => stopMining(mining.line, `^C · stopped after ${count.format(mining.tries)} tries`)}
                    className="shrink-0 border-2 border-bone px-2 py-0.5 text-[12px] uppercase"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          </Slam>

          <div className="mt-8">
            <p className="meta">try</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TRY.map((command) => (
                <li key={command}>
                  <button
                    type="button"
                    onClick={() => runFromOutput(command)}
                    className="chip chip-lower hover:bg-ink hover:text-bone focus-visible:bg-ink focus-visible:text-bone"
                  >
                    {command}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProveIt
        eyebrow="the same chain, with pictures"
        title="Prefer to click?"
        lead="Everything the terminal reads is on the site too. These two are the ones it can’t show as well as the pages do."
      />
    </>
  )
}
