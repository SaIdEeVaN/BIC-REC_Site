// The chain, for real.
//
// Every event in src/data/events.js is a block. A block's hash is the SHA-256 of its record — its height, the
// hash of the block before it, and the facts of the event — so each hash covers every block that came before.
// Change one character of one record and that block's hash changes, and with it every hash after.
//
// These are the hashes shown wherever the site shows an event (the ledger, the ticker, the event's own page),
// and the ones /chain re-derives in front of the visitor. Until this existed they were decorative: a short
// checksum of the event's slug, made to look like a hash.
//
// The chain is derived, like everything else on the site (the block clock, the stats): nothing here is stored,
// so adding an event to the data extends the chain with nothing else to keep in step. That is also its limit,
// and /chain says so — a chain rebuilt from one copy of the records shows the blocks agree with each other,
// not that the records were never edited. A real blockchain adds many independent copies and a cost to seal.
//
// No browser-only or Vite-only code: this is read by the page, the build and the tests.
import { events } from '../data/events.js'
import { sha256 } from './sha256.js'

// The first block has nothing before it. Its "previous hash" is 64 zeros, as Bitcoin's genesis block has.
export const GENESIS_PREVIOUS = '0'.repeat(64)

// The facts a block seals, in the order they are written. `summary` is the event's one-line description.
export const RECORD_FIELDS = ['title', 'date', 'venue', 'type', 'summary']

export const recordOf = (event) => ({
  title: event.title,
  date: event.date,
  venue: event.venue ?? '',
  type: event.type,
  summary: event.description,
})

// One value per line, so a value may not bring a line break of its own.
const oneLine = (value) => String(value).replace(/\s*[\r\n]+\s*/g, ' ')

// What gets hashed, byte for byte (as UTF-8). It is plain text on purpose: anyone can paste it into any
// SHA-256 tool and get the same 64 characters, which is the whole point of showing it.
export const preimage = (height, previous, record) =>
  [
    'bic/rec block',
    `height: ${height}`,
    `previous: ${previous}`,
    ...RECORD_FIELDS.map((field) => `${field}: ${oneLine(record[field])}`),
  ].join('\n')

export const seal = (height, previous, record) => sha256(preimage(height, previous, record))

// Hashes down a list of records, each block taking the hash of the one before as its `previous`.
const chainOf = (records) => {
  const chain = []
  records.forEach((record, i) => {
    const previous = i ? chain[i - 1].hash : GENESIS_PREVIOUS
    chain.push({ height: i + 1, previous, hash: seal(i + 1, previous, record) })
  })
  return chain
}

// The chain as the club's records give it: one block per event, oldest first. A block's height is its event's
// id (tests/unit/dates.test.js holds the ids to 1, 2, 3… in date order).
export const blocks = chainOf(events.map(recordOf)).map((block, i) => ({
  ...block,
  event: events[i],
  record: recordOf(events[i]),
}))

// The latest block: the head of the chain.
export const head = blocks.at(-1)

export const blockOf = (event) => blocks[events.indexOf(event)]

// A hash as the site prints it in passing: 0x1a2…9fe.
export const short = (hash) => `0x${hash.slice(0, 3)}…${hash.slice(-3)}`

// Re-derives the chain from `records` (one per block, in order) and holds each block against its seal.
// A block is intact only if its hash still comes out as it was sealed — and since its hash covers the hash
// before it, one altered record leaves every later block broken too.
export const recompute = (records) =>
  chainOf(records).map((block, i) => ({ ...block, intact: block.hash === blocks[i].hash }))

// Mining (/mine): the block a visitor seals on top of the head. Everything before the nonce is fixed, so the
// miner hashes this prefix followed by one number after another until the hash starts with enough zeros.
export const nextHeight = (head?.height ?? 0) + 1

// A name is typed by a visitor: one line, single spaces, and short enough to fit the record.
export const minerName = (text) => oneLine(text).replace(/\s+/g, ' ').trim().slice(0, 40) || 'anonymous'

export const miningPrefix = (miner) =>
  ['bic/rec block', `height: ${nextHeight}`, `previous: ${head?.hash ?? GENESIS_PREVIOUS}`, `miner: ${miner}`, 'nonce: '].join('\n')
