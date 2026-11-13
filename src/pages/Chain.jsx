import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Chip, InkCTA, PageHeader, SectionHeading, TrackCards } from '../components/kit'
import { AMBER, Reveal, Slam, Stamp, useCanAnimate } from '../components/motion'
import ProveIt from '../components/ProveIt'
import { isUpcoming } from '../data/events'
import { blockNo, pad2, sealedDate } from '../lib/chain'
import { GENESIS_PREVIOUS, RECORD_FIELDS, blocks, head, preimage, recompute, short } from '../lib/ledger'

// The chain, opened up. Three things happen here, in the order a visitor meets them:
//
// 1. Verify. The browser re-derives every block's hash from its record with its *own* SHA-256 (crypto.subtle),
//    not the site's, and each block is held against the hash it was sealed with.
// 2. Tamper. Any block opens to its record, which can be edited. From then on the chain is re-derived on every
//    keystroke (with the site's SHA-256, which is immediate): the edited block stops matching its seal, and so
//    does every block after it, because each one sealed the hash of the block before.
// 3. The limit. This chain is one copy, rebuilt from the club's records at every build. The page says what
//    that does and doesn't prove, and sends the visitor on to /mine for the part a real chain adds.

const SEALED = blocks.map((block) => block.record)
const STEP = 130 // ms between blocks while a verification rolls down the chain

// A statement per status, in the system's states: solid = checked and holding, amber = the one that was
// changed, hollow = no longer holding (or not looked at yet).
const STATUS = {
  unchecked: { label: 'Unchecked', tone: 'outline' },
  verified: { label: 'Verified', tone: 'solid' },
  altered: { label: 'Altered', tone: 'pending' },
  broken: { label: 'Broken', tone: 'outline' },
}

const edited = (record, i) => RECORD_FIELDS.some((field) => record[field] !== SEALED[i][field])

const hex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')

// The same chain, derived by the browser's own SHA-256. Null where a browser has none to offer (plain http).
async function chainByBrowser(records) {
  if (!globalThis.crypto?.subtle) return null
  const hashes = []
  for (const [i, record] of records.entries()) {
    const text = preimage(i + 1, i ? hashes[i - 1] : GENESIS_PREVIOUS, record)
    hashes.push(hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))))
  }
  return hashes
}

function Field({ label, as: Tag = 'input', ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <Tag className="field" autoComplete="off" spellCheck="false" {...props} />
    </label>
  )
}

// The bar joining a block to the one above it. The link is what the block below sealed: the hash of the block
// above. So it breaks when the block *above* stops matching its seal, and the bar is drawn cut.
function Joint({ broken }) {
  return (
    <div aria-hidden="true" className="ml-8 flex h-9 items-center gap-4">
      {broken ? (
        <>
          <span className="flex h-full w-[3px] flex-col justify-between">
            <span className="block h-[11px] bg-ink" />
            <span className="block h-[11px] bg-ink" />
          </span>
          <span className="font-mono text-[12px] font-medium uppercase">link broken</span>
        </>
      ) : (
        <span className="block h-full w-[3px] bg-ink" />
      )}
    </div>
  )
}

function Hash({ label, value }) {
  return (
    <div className="flex gap-3">
      <dt className="meta w-[74px] shrink-0">{label}</dt>
      <dd className="font-mono text-[12.5px] font-medium">{value}</dd>
    </div>
  )
}

function Block({ block, index, record, result, status, linkBroken, open, onToggle, onChange }) {
  const upcoming = isUpcoming(block.event)
  const { label, tone } = STATUS[status]
  const panel = `block-${block.height}-record`
  const mismatch = status === 'altered' || status === 'broken'

  return (
    // scroll-mt: a link to /chain#block-3 lands the block below the sticky header, not under it.
    <li id={`block-${block.height}`} className="scroll-mt-[120px]">
      {index > 0 && <Joint broken={linkBroken} />}
      <article className={`border-3 border-ink bg-bone ${open ? 'shadow-ink' : ''}`}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="meta">
              {blockNo(block.height)} · {upcoming ? 'pending' : `sealed ${sealedDate(block.event.date)}`}
            </p>
            {/* A verdict is stamped on, and stamped afresh each time it changes (the key). A block nobody has
                checked yet has no verdict to stamp, so its chip is simply there. */}
            {status === 'unchecked' ? (
              <Chip tone={tone}>{label}</Chip>
            ) : (
              <Stamp key={status} trigger="mount">
                <Chip tone={tone}>{label}</Chip>
              </Stamp>
            )}
          </div>
          <h3 className="t-row mt-3">{record.title || '—'}</h3>
          <dl className="mt-4 flex flex-col gap-1">
            <Hash label="previous" value={index ? short(result.previous) : `${short(result.previous)} · genesis`} />
            <Hash label="hash" value={short(result.hash)} />
            {mismatch && <Hash label="sealed as" value={short(block.hash)} />}
          </dl>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panel}
            onClick={onToggle}
            className="mt-4 font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4"
          >
            {open ? 'close the block' : 'open the block'}
            <span className="sr-only"> {blockNo(block.height)}</span>
          </button>
        </div>

        {open && (
          <div id={panel} className="border-t-3 border-ink p-5">
            <p className="meta">the record · change anything</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {RECORD_FIELDS.map((field) => (
                <div key={field} className={field === 'summary' || field === 'title' ? 'sm:col-span-2' : ''}>
                  <Field
                    label={field}
                    as={field === 'summary' ? 'textarea' : 'input'}
                    rows={field === 'summary' ? 3 : undefined}
                    value={record[field]}
                    onChange={(e) => onChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <p className="meta mt-7">what gets hashed, byte for byte</p>
            <pre className="mt-2 whitespace-pre-wrap break-all border-3 border-ink p-3 font-mono text-[12px] leading-relaxed">
              {preimage(block.height, result.previous, record)}
            </pre>

            <dl className="mt-5 flex flex-col gap-3">
              <div>
                <dt className="meta">sha-256 of that</dt>
                <dd className="mt-1 break-all font-mono text-[12.5px] font-medium">{result.hash}</dd>
              </div>
              <div>
                <dt className="meta">sealed as</dt>
                <dd className="mt-1 break-all font-mono text-[12.5px] font-medium">{block.hash}</dd>
              </div>
            </dl>
            <p className="t-small mt-5">
              Paste the record into any SHA-256 tool and it gives the same 64 characters. Nothing about the hash
              depends on this site.
            </p>
          </div>
        )}
      </article>
    </li>
  )
}

// What the whole chain comes to, in words. `seen` is how far a verification has got (null: none run yet).
function verdictOf({ seen, results, records, native }) {
  const total = blocks.length

  if (seen === null) {
    return {
      headline: 'Not checked yet',
      detail: 'Your browser will work out every block’s hash from its record, and hold each one against the hash the block was sealed with.',
    }
  }
  if (seen < total) return { headline: `Checking block ${seen + 1} of ${total}`, detail: 'Hashing each record in turn.' }

  const first = results.findIndex((result) => !result.intact)
  if (first === -1) {
    const how = native?.agrees
      ? `Recomputed by your browser’s own SHA-256 in ${Math.max(1, Math.round(native.ms))} ms. It agrees with every hash on this site.`
      : 'Recomputed from the records, block by block. Every hash is the one its block was sealed with.'
    return { headline: `All ${total} blocks verified`, detail: how }
  }

  const after = total - first - 1
  const rest =
    after === 0
      ? 'It is the head of the chain, so nothing was built on it to break.'
      : `The ${after === 1 ? 'block' : `${after} blocks`} after it broke with it: each one sealed the hash of the block before.`
  return {
    headline: `Broken at ${blockNo(blocks[first].height)}`,
    detail: `${edited(records[first], first) ? 'Its record was changed, so its hash' : 'Its hash'} no longer matches its seal. ${rest}`,
    broken: true,
  }
}

const HOW = [
  {
    title: 'A block is a record',
    body: 'Every event is written down the same way: its height, the hash of the block before it, then its title, date, venue, type and a one-line summary.',
  },
  {
    title: 'Its hash is its seal',
    body: 'SHA-256 turns that record into 64 characters. Change a comma and all 64 change, so a seal only fits the record it was made from.',
  },
  {
    title: 'Each seal covers the last',
    body: 'Because a record includes the hash before it, the blocks are a chain rather than a list. To alter one you would have to re-seal every block after it.',
  },
]

export default function Chain() {
  const canAnimate = useCanAnimate()
  const { hash: anchor } = useLocation()
  // /chain#block-3 (the "verify this block" link on an event's page) arrives with that block open.
  const linked = blocks.findIndex((block) => anchor === `#block-${block.height}`)

  const [records, setRecords] = useState(SEALED)
  const [open, setOpen] = useState(linked === -1 ? null : linked)
  const [seen, setSeen] = useState(null)
  const [native, setNative] = useState(null)

  const results = useMemo(() => recompute(records), [records])
  const total = blocks.length
  const changed = records !== SEALED && records.some(edited)

  // A verification rolls down the chain one block at a time; after that the chain is simply live.
  useEffect(() => {
    if (seen === null || seen >= total) return
    const id = setTimeout(() => setSeen((n) => n + 1), STEP)
    return () => clearTimeout(id)
  }, [seen, total])

  useEffect(() => {
    if (linked !== -1) document.getElementById(`block-${blocks[linked].height}`)?.scrollIntoView()
  }, [linked])

  const verify = async () => {
    const started = performance.now()
    const theirs = await chainByBrowser(records)
    setNative(theirs && { ms: performance.now() - started, agrees: theirs.every((hash, i) => hash === results[i].hash) })
    setSeen(canAnimate ? 0 : total)
  }

  const change = (i, field, value) =>
    setRecords((current) => current.map((record, j) => (j === i ? { ...record, [field]: value } : record)))

  const statusOf = (i) => {
    if (seen === null || i >= seen) return 'unchecked'
    if (results[i].intact) return 'verified'
    return edited(records[i], i) ? 'altered' : 'broken'
  }

  const verdict = verdictOf({ seen, results, records, native })
  const checking = seen !== null && seen < total

  return (
    <>
      <PageHeader
        eyebrow="don’t trust, verify"
        title="The chain"
        lead="Every event the club has run is a block. Each block’s hash is a real SHA-256 over its record and the hash of the block before it, so the club’s whole history hangs off the one hash at the head. Check it yourself."
        aside={[
          ['blocks', pad2(total)],
          ['genesis', sealedDate(blocks[0].event.date)],
          ['head', short(head.hash)],
        ]}
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading
            eyebrow="the ledger, opened"
            title="Check every block"
            lead="Each block shows the hash it carries and the hash of the block before it. Verify them, then open any block and change something."
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <ol>
              {blocks.map((block, i) => (
                <Block
                  key={block.height}
                  block={block}
                  index={i}
                  record={records[i]}
                  result={results[i]}
                  status={statusOf(i)}
                  linkBroken={i > 0 && ['altered', 'broken'].includes(statusOf(i - 1))}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                  onChange={(field, value) => change(i, field, value)}
                />
              ))}
            </ol>

            <aside className="order-first lg:sticky lg:top-[100px] lg:order-last">
              <Slam color={AMBER} className="on-ink bg-ink p-6 text-bone shadow-amber md:p-7">
                <p className="meta">verdict</p>
                <div role="status">
                  <h2 className="t-card mt-4">{verdict.headline}</h2>
                  <p className="t-small mt-3">{verdict.detail}</p>
                </div>
                <div className="mt-7 flex flex-wrap gap-5">
                  <Button variant="onInk" onClick={verify} disabled={checking}>
                    {seen === null ? 'Verify the chain' : 'Verify again'}
                  </Button>
                  {changed && (
                    <Button variant="ghostOnInk" onClick={() => setRecords(SEALED)}>
                      Put it back
                    </Button>
                  )}
                </div>
              </Slam>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="why it holds" title="Change one block, break them all" />
          <TrackCards items={HOW} />

          <Reveal className="mt-10 border-3 border-ink p-6 md:mt-14 md:p-8">
            <p className="meta">the honest part</p>
            <h3 className="t-h3 mt-4 max-w-[20ch]">What this does not prove</h3>
            <p className="t-body mt-5 max-w-[68ch]">
              This chain is one copy, and it is rebuilt from the club’s records every time the site is published. So it
              shows that the blocks agree with each other. It does not show that nobody ever changed a record and
              sealed the whole chain again, because here that costs nothing.
            </p>
            <p className="t-body mt-4 max-w-[68ch]">
              A real blockchain closes that gap twice over: thousands of independent machines each hold a copy, and
              sealing a block costs real work. Rewriting history then means redoing that work for every block since,
              faster than everyone else is adding new ones.
            </p>
          </Reveal>
        </div>
      </section>

      <ProveIt
        current="chain"
        eyebrow="the part a real chain adds"
        title="Now seal one yourself"
        lead="Find out what that work is: mine the next block on top of this chain’s head, in your browser."
      />

      <InkCTA
        title="See what was sealed"
        body="Every block here is an event the club ran. The ledger has the full account of each, and the gallery has the photos."
      >
        <Button to="/events" variant="onInk">Open the event ledger</Button>
        <Button to="/gallery" variant="ghostOnInk">See the gallery</Button>
      </InkCTA>
    </>
  )
}
