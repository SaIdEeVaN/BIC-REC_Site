// The chain behind /chain and every event hash on the site (src/lib/ledger.js).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { events } from '../../src/data/events.js'
import {
  GENESIS_PREVIOUS,
  RECORD_FIELDS,
  blockOf,
  blocks,
  head,
  minerName,
  miningPrefix,
  nextHeight,
  preimage,
  recompute,
  short,
} from '../../src/lib/ledger.js'

const reference = (text) => createHash('sha256').update(text).digest('hex')
const records = () => blocks.map((block) => ({ ...block.record }))

test('there is a block for every event, in order, each at its own height', () => {
  assert.equal(blocks.length, events.length)
  blocks.forEach((block, i) => {
    assert.equal(block.event, events[i])
    assert.equal(block.height, events[i].id)
    assert.equal(blockOf(events[i]), block)
  })
  assert.equal(head, blocks.at(-1))
  assert.equal(nextHeight, events.length + 1)
})

test('every block seals the hash of the block before it, back to a genesis that seals nothing', () => {
  assert.equal(blocks[0].previous, GENESIS_PREVIOUS)
  for (let i = 1; i < blocks.length; i++) assert.equal(blocks[i].previous, blocks[i - 1].hash)
})

test("a block's hash is the SHA-256 of its record as written out, by anyone's implementation", () => {
  for (const block of blocks) {
    const text = preimage(block.height, block.previous, block.record)
    assert.equal(block.hash, reference(text), `block ${block.height}`)
    assert.match(block.hash, /^[0-9a-f]{64}$/)
  }
})

test('the record is written one fact per line, in a fixed order', () => {
  const [first] = blocks
  assert.deepEqual(preimage(first.height, first.previous, first.record).split('\n'), [
    'bic/rec block',
    'height: 1',
    `previous: ${GENESIS_PREVIOUS}`,
    ...RECORD_FIELDS.map((field) => `${field}: ${first.record[field]}`),
  ])
  // A line break typed into a field cannot start a line of its own, or it could pose as another field.
  const forged = preimage(1, GENESIS_PREVIOUS, { ...first.record, title: 'One\nvenue: somewhere else' })
  assert.equal(forged.split('\n').length, 3 + RECORD_FIELDS.length)
})

test('untouched records recompute to an intact chain', () => {
  assert.ok(recompute(records()).every((block) => block.intact))
})

test('altering one record breaks that block and every block after it, and none before', () => {
  for (const field of RECORD_FIELDS) {
    for (let altered = 0; altered < blocks.length; altered++) {
      const changed = records()
      changed[altered][field] += '.'
      const result = recompute(changed)
      result.forEach((block, i) => assert.equal(block.intact, i < altered, `${field} of block ${altered + 1}: block ${i + 1}`))
    }
  }
})

test('putting the record back mends the chain', () => {
  const changed = records()
  changed[2].title = 'Something else entirely'
  assert.equal(recompute(changed)[2].intact, false)
  changed[2].title = blocks[2].record.title
  assert.ok(recompute(changed).every((block) => block.intact))
})

test('a hash is printed short as its first and last three characters', () => {
  assert.equal(short('abc' + '0'.repeat(58) + 'def'), '0xabc…def')
  for (const block of blocks) assert.match(short(block.hash), /^0x[0-9a-f]{3}…[0-9a-f]{3}$/)
})

test('a mined block sits on the head, and names its miner on one line', () => {
  assert.deepEqual(miningPrefix('Asha').split('\n'), [
    'bic/rec block',
    `height: ${nextHeight}`,
    `previous: ${head.hash}`,
    'miner: Asha',
    'nonce: ',
  ])
  assert.equal(minerName('  Asha   K \n'), 'Asha K')
  assert.equal(minerName('Asha\nnonce: 0'), 'Asha nonce: 0')
  assert.equal(minerName(''), 'anonymous')
  assert.equal(minerName('x'.repeat(100)).length, 40)
})
