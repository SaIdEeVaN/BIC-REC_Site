import { useEffect, useRef, useState } from 'react'
import { Button, Chip, PageHeader, SectionHeading, Tabs } from '../components/kit'
import { Reveal, Slam, SplitText, Stamp, useCanAnimate } from '../components/motion'
import ProveIt from '../components/ProveIt'
import { blockNo } from '../lib/chain'
import { head, minerName, miningPrefix, nextHeight, short } from '../lib/ledger'
import { sha256 } from '../lib/sha256'

// Proof of work, actually done. The visitor's block sits on the head of the club's chain: its height, the
// head's hash, their name, and a nonce. A worker (lib/miner.worker.js) hashes it with nonce 0, 1, 2… until the
// SHA-256 starts with as many zeros as were asked for. Nothing here is an animation of mining: the counter is
// the worker's own count, and the hash that lands can be checked with any SHA-256 tool.
//
// The block is not added to anything. There is no backend, so it exists in this tab and nowhere else — the
// page says so, rather than letting "mined" suggest it joined the chain.

const DIFFICULTIES = ['3', '4', '5', '6', '7']
const DEFAULT_ZEROS = 5

// What the table sets a visitor's speed against. 19 is roughly what Bitcoin's network has to find for every
// block (2026): its target has 19 hex zeros before the first other digit.
const SCALE = [4, 5, 6, 7, 8, 12, 19]
const BITCOIN = 19

const count = new Intl.NumberFormat('en-US')

const BIG = ['million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion']

// 65,536 · 16.8 million · 75.6 sextillion
function roughly(n) {
  if (n < 1e6) return count.format(Math.round(n))
  const step = Math.min(Math.floor(Math.log10(n) / 3) - 2, BIG.length - 1)
  return `${Number((n / 10 ** ((step + 2) * 3)).toPrecision(3))} ${BIG[step]}`
}

const YEAR = 31_557_600

// "1 second", "17 seconds": the unit agrees with the number in front of it.
const some = (n, unit) => `${count.format(Math.round(n))} ${unit}${Math.round(n) === 1 ? '' : 's'}`

function howLong(seconds) {
  if (seconds < 1) return 'under a second'
  if (seconds < 90) return some(seconds, 'second')
  if (seconds < 5400) return some(seconds / 60, 'minute')
  if (seconds < 172_800) return some(seconds / 3600, 'hour')
  if (seconds < YEAR * 2) return some(seconds / 86_400, 'day')
  return `${roughly(seconds / YEAR)} years`
}

// On average a hash starts with z zeros once in 16^z tries: each extra zero is sixteen times the work.
const expectedTries = (zeros) => 16 ** zeros

const hex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')

// The same block, hashed by the browser's own SHA-256. Null where a browser has none to offer (plain http).
async function hashByBrowser(text) {
  if (!globalThis.crypto?.subtle) return null
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
}

// A hash with the zeros it was mined for picked out.
function MinedHash({ hash, zeros }) {
  return (
    <span className="break-all font-mono text-[13px] font-medium">
      <span className="bg-amber text-coal">{hash.slice(0, zeros)}</span>
      {hash.slice(zeros)}
    </span>
  )
}

// Finding a block takes a million tries; checking one takes a single hash. Someone says they mined a block:
// their name and their nonce are the whole claim, and anyone can settle it. Nothing is stored or sent, so this
// is how two people compare blocks — at a stall, over a message — without the site keeping a leaderboard.
function CheckBlock() {
  const [name, setName] = useState('')
  const [nonce, setNonce] = useState('')

  // A nonce is a whole number; commas and spaces are how people copy one ("179,936").
  const digits = nonce.replace(/[\s,]/g, '')
  const claimed = name.trim() !== '' && /^\d{1,15}$/.test(digits)
  const hash = claimed ? sha256(`${miningPrefix(minerName(name))}${Number(digits)}`) : null
  const zeros = hash ? hash.match(/^0*/)[0].length : 0

  return (
    <section className="border-b-3 border-ink">
      <div className="wrap section">
        <SectionHeading
          eyebrow="finding is hard, checking is one hash"
          title="Check someone’s block"
          lead="A friend says they mined a block? Their name and their nonce are the whole claim. Type them in and one hash settles it."
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">the miner’s name, as they typed it</span>
              <input className="field" type="text" maxLength={40} autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="field-label">their nonce</span>
              <input className="field" type="text" inputMode="numeric" autoComplete="off" value={nonce} onChange={(e) => setNonce(e.target.value)} />
            </label>
            <p className="meta sm:col-span-2">
              a block sits on the head of the chain ({short(head.hash)}), so one mined before the club’s latest event
              no longer checks out
            </p>
          </div>

          <div aria-live="polite" data-check-result className="border-3 border-ink p-5 md:p-6">
            {hash ? (
              <>
                <p className="meta">sha-256 of {minerName(name)}’s block with nonce {count.format(Number(digits))}</p>
                <p className="mt-3">
                  <MinedHash hash={hash} zeros={zeros} />
                </p>
                <p className="t-card mt-5">
                  {zeros === 0 ? 'No zeros' : `${zeros} ${zeros === 1 ? 'zero' : 'zeros'}`}
                </p>
                <p className="t-small mt-3">
                  {zeros === 0
                    ? 'This hash starts with no zeros, so the nonce proves no work at all. Any number does this well.'
                    : `A real block at difficulty ${zeros}: about ${roughly(expectedTries(zeros))} tries stand behind it, on average.`}
                </p>
              </>
            ) : (
              <>
                <p className="meta">nothing to check yet</p>
                <p className="t-small mt-3">The hash appears here as soon as there is a name and a nonce.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Readout({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-3 border-bone px-4 py-2.5 first:border-t-0">
      <dt className="meta shrink-0">{label}</dt>
      <dd className="min-w-0 text-right font-mono text-[12.5px] font-medium">{children}</dd>
    </div>
  )
}

const STEPS = [
  'The block is written out: its height, the hash of the block before it, your name, and one number called the nonce.',
  'The whole thing is hashed. If the hash doesn’t start with enough zeros, the nonce goes up by one and it is hashed again.',
  'Nothing predicts which nonce will work, so the only way through is to try. That work is what makes a block costly to fake.',
]

export default function MineBlock() {
  const canAnimate = useCanAnimate()
  const [name, setName] = useState('')
  const [zeros, setZeros] = useState(DEFAULT_ZEROS)
  // The search under way or just finished: what is being mined, how far it has got, and what it found.
  const [run, setRun] = useState(null)
  // Hashes per second, from the last search. It outlives the search, because the table is read against it.
  const [rate, setRate] = useState(null)
  const worker = useRef(null)

  const mining = Boolean(run) && !run.found && !run.failed

  const stop = () => {
    worker.current?.terminate()
    worker.current = null
  }

  // Leaving the page mid-search must not leave a thread hashing for nobody.
  useEffect(() => () => worker.current?.terminate(), [])

  const start = (difficulty) => {
    stop()
    const miner = minerName(name)
    const prefix = miningPrefix(miner)
    const thread = new Worker(new URL('../lib/miner.worker.js', import.meta.url), { type: 'module' })
    worker.current = thread
    setRun({ miner, prefix, zeros: difficulty, tries: 0, ms: 0 })

    thread.onmessage = ({ data }) => {
      // A search that was stopped or replaced has nothing more to say.
      if (worker.current !== thread) return
      setRun((current) => ({ ...current, ...data }))
      if (data.ms > 40) setRate(data.tries / (data.ms / 1000))
      if (!data.found) return

      stop()
      // One more opinion: the browser's own SHA-256 on the finished block.
      hashByBrowser(prefix + data.nonce).then((theirs) =>
        setRun((current) => (current?.prefix === prefix && theirs ? { ...current, agreed: theirs === data.hash } : current)),
      )
    }
    thread.onerror = () => {
      stop()
      setRun((current) => ({ ...current, failed: true }))
    }
    thread.postMessage({ prefix, zeros: difficulty })
  }

  const cancel = () => {
    stop()
    setRun(null)
  }

  const submit = (e) => {
    e.preventDefault()
    if (mining) cancel()
    else start(zeros)
  }

  const pick = (option) => {
    // Changing the difficulty abandons a search for the old one rather than leaving it running out of sight.
    if (mining) cancel()
    setZeros(Number(option))
  }

  const harder = () => {
    const next = Math.min(run.zeros + 1, Number(DIFFICULTIES.at(-1)))
    setZeros(next)
    start(next)
  }

  const found = run?.found
  const record = found ? `${run.prefix}${run.nonce}` : null
  const luck = found ? run.tries / expectedTries(run.zeros) : null

  return (
    <>
      <PageHeader
        eyebrow="proof of work"
        title="Mine a block"
        lead="A block only joins a real chain when its hash starts with enough zeros. There is no shortcut to finding one: change a number, hash again, and repeat until it does. Your browser will do it for real."
        aside={[
          ['next block', blockNo(nextHeight).replace('block ', '')],
          ['on top of', short(head.hash)],
          ['hash', 'sha-256'],
        ]}
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section grid gap-12 lg:grid-cols-[minmax(0,1fr)_620px] lg:items-start">
          <div>
            <Reveal>
              <h2 className="t-h3">How it works</h2>
              <ol className="mt-6 border-3 border-ink">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-4 border-t-3 border-ink px-4 py-4 first:border-t-0">
                    <span aria-hidden="true" className="meta mt-[3px] shrink-0">
                      0{i + 1}
                    </span>
                    <span className="t-small">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-10" delay={120}>
              <h2 className="t-h3">Each zero is 16× the work</h2>
              <p className="t-small mt-4 max-w-[52ch]">
                {rate
                  ? `This machine just managed about ${roughly(rate)} hashes a second. At that speed:`
                  : 'Mine a block and the last column fills in with how long each would take at your machine’s speed.'}
              </p>
              <table className="mt-5 w-full border-3 border-ink text-left">
                <thead>
                  <tr className="on-ink bg-ink text-bone">
                    <th scope="col" className="px-4 py-2.5 font-mono text-[12px] font-medium lowercase">zeros</th>
                    <th scope="col" className="px-4 py-2.5 font-mono text-[12px] font-medium lowercase">tries, on average</th>
                    <th scope="col" className="px-4 py-2.5 font-mono text-[12px] font-medium lowercase">at this speed</th>
                  </tr>
                </thead>
                <tbody>
                  {SCALE.map((z) => (
                    <tr key={z} className={`border-t-3 border-ink ${z === BITCOIN ? 'bg-amber text-coal' : ''}`}>
                      <th scope="row" className="px-4 py-3 align-top font-mono text-[12.5px] font-medium">
                        {z}
                        {z === BITCOIN && <span className="block lowercase">bitcoin, roughly</span>}
                      </th>
                      <td className="px-4 py-3 align-top text-[14.5px] font-bold">{roughly(expectedTries(z))}</td>
                      <td className="px-4 py-3 align-top text-[14.5px] font-bold">
                        {rate ? howLong(expectedTries(z) / rate) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>

          <Slam className="border-3 border-ink bg-bone p-6 shadow-ink md:p-8">
            <form onSubmit={submit} className="flex flex-col gap-6">
              <h2 className="t-h3">Your block</h2>

              <label className="block">
                <span className="field-label">your name, or anything you like</span>
                <input
                  className="field"
                  type="text"
                  name="miner"
                  maxLength={40}
                  autoComplete="off"
                  placeholder="anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={mining}
                />
              </label>

              <div>
                <p className="field-label">zeros the hash must start with</p>
                <Tabs label="Zeros the hash must start with" options={DIFFICULTIES} value={String(zeros)} onChange={pick} />
                <p className="meta mt-3">about {roughly(expectedTries(zeros))} tries, on average</p>
              </div>

              <Button type="submit" variant={mining ? 'bone' : 'amber'} className="w-full">
                {mining ? 'Stop' : found ? 'Mine it again' : 'Start mining'}
              </Button>
            </form>

            {run && !run.failed && (
              <div className="on-ink mt-7 bg-ink p-5 text-bone md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="meta">
                    {blockNo(nextHeight)} · {found ? 'found' : 'mining'}
                  </p>
                  {found && (
                    <Stamp trigger="mount">
                      <Chip tone="shipped">Mined</Chip>
                    </Stamp>
                  )}
                </div>

                {/* The search itself is noise to a screen reader (a hash that changes twelve times a second),
                    so it is hidden while it runs; the result below is what gets announced. */}
                <dl aria-hidden={!found} className="mt-5 border-3 border-bone">
                  <Readout label="miner">{run.miner}</Readout>
                  <Readout label="difficulty">
                    {run.zeros} {run.zeros === 1 ? 'zero' : 'zeros'}
                  </Readout>
                  <Readout label={found ? 'nonce' : 'trying nonce'}>
                    {found || canAnimate ? count.format(run.nonce ?? 0) : 'searching'}
                  </Readout>
                  <Readout label="tries">{found || canAnimate ? count.format(run.tries) : '…'}</Readout>
                  <Readout label="speed">{run.ms > 40 ? `${roughly(run.tries / (run.ms / 1000))} hashes/s` : '…'}</Readout>
                  <Readout label="time">{found ? `${(run.ms / 1000).toFixed(run.ms < 10_000 ? 2 : 1)} s` : `${Math.floor(run.ms / 1000)} s`}</Readout>
                </dl>

                <div role="status">
                  {found ? (
                    <>
                      <h3 className="t-card mt-6">
                        <SplitText text="Block found" trigger="mount" />
                      </h3>
                      <p className="mt-4">
                        <MinedHash hash={run.hash} zeros={run.zeros} />
                      </p>
                      <p className="t-small mt-4">
                        Nonce {count.format(run.nonce)} is the first that works: it took {count.format(run.tries)}{' '}
                        {run.tries === 1 ? 'try' : 'tries'}, where {roughly(expectedTries(run.zeros))} is the average.{' '}
                        {luck < 0.5 ? 'That was lucky.' : luck > 2 ? 'That was unlucky.' : 'About what the odds said.'}
                      </p>
                      {run.agreed && (
                        <p className="meta mt-3">confirmed by your browser’s own sha-256</p>
                      )}
                    </>
                  ) : (
                    <p className="sr-only">Mining. The result will be announced when a block is found.</p>
                  )}
                </div>

                {/* While it searches: the candidate the worker last reported, so the work can be seen. */}
                {!found && canAnimate && run.hash && (
                  <p aria-hidden="true" className="mt-5 break-all font-mono text-[13px] font-medium">
                    {run.hash}
                  </p>
                )}

                {found && (
                  <>
                    <p className="meta mt-6">the block, byte for byte</p>
                    <pre className="mt-2 whitespace-pre-wrap break-all border-3 border-bone p-3 font-mono text-[12px] leading-relaxed">
                      {record}
                    </pre>
                    <p className="t-small mt-4">
                      Paste it into any SHA-256 tool and the same hash comes out. It lives in this tab only: nothing
                      was sent anywhere, and it was not added to the club’s chain.
                    </p>
                    {run.zeros < Number(DIFFICULTIES.at(-1)) && (
                      <div className="mt-6">
                        <Button variant="onInk" onClick={harder}>
                          Add a zero
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {run?.failed && (
              <p role="alert" className="mt-6 text-[14px] font-bold">
                <span className="font-mono text-[12px] font-medium">error · </span>
                The miner couldn’t start in this browser.
              </p>
            )}
          </Slam>
        </div>
      </section>

      <CheckBlock />

      <ProveIt
        current="mine"
        eyebrow="what the work protects"
        title="Now try to cheat"
        lead="Sealing one block took your machine real work. Rewriting history means redoing that work for every block after the one you changed. See what breaks."
      />
    </>
  )
}
