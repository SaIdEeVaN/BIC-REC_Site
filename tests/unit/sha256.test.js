// The site's own SHA-256 (src/lib/sha256.js) is what seals every block and what the miner runs a million times
// a second. If it were subtly wrong, every hash on the site would be a number that looks like a hash and isn't
// one. These hold it to Node's implementation, byte for byte.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createMiner, hexOf, meetsDifficulty, sha256, sha256Bytes } from '../../src/lib/sha256.js'

const reference = (input) => createHash('sha256').update(input).digest('hex')

test('the published test vectors come out right', () => {
  assert.equal(sha256(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  assert.equal(sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  assert.equal(
    sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'),
    '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
  )
})

test('every length around a block boundary agrees with Node', () => {
  // 55/56 and 119/120 are where the padding spills into another block; 64 and 128 are whole blocks.
  for (let length = 0; length <= 200; length++) {
    const text = 'x'.repeat(length)
    assert.equal(sha256(text), reference(text), `length ${length}`)
  }
})

test('text outside ASCII is hashed as UTF-8', () => {
  for (const text of ['Home of Hope Children’s Home, near Porur', 'சென்னை', 'ब्लॉकचेन', '“quoted” — dashed', '🧱⛓️']) {
    assert.equal(sha256(text), reference(text), text)
  }
})

test('arbitrary bytes agree with Node', () => {
  // A fixed sequence rather than Math.random, so a failure can be reproduced.
  let seed = 0x2545f491
  const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0)
  for (let round = 0; round < 300; round++) {
    const bytes = Uint8Array.from({ length: next() % 400 }, () => next() & 0xff)
    assert.equal(hexOf(sha256Bytes(bytes)), reference(bytes))
  }
})

test('a megabyte agrees with Node', () => {
  const bytes = new Uint8Array(1 << 20).map((_, i) => (i * 31) & 0xff)
  assert.equal(hexOf(sha256Bytes(bytes)), reference(bytes))
})

test('the miner hashes prefix + nonce exactly as hashing the whole text would', () => {
  // Prefix lengths on both sides of every block boundary, and nonces across each change in digit count —
  // the two places the miner's shortcuts (the saved midstate, the reused padding) could go wrong.
  const nonces = [0, 1, 9, 10, 11, 99, 100, 999, 1000, 4095, 4096, 99999, 100000, 1234567, 99999999, 100000000, 4294967295, 4294967296]
  for (const length of [0, 1, 40, 46, 47, 54, 55, 56, 63, 64, 65, 100, 118, 119, 120, 127, 128, 129, 200]) {
    const prefix = 'p'.repeat(length)
    const tryNonce = createMiner(prefix)
    for (const nonce of nonces) {
      assert.equal(hexOf(tryNonce(nonce)), reference(prefix + nonce), `prefix ${length}, nonce ${nonce}`)
    }
    // Back down again: a smaller number after a larger one must not leave digits behind.
    assert.equal(hexOf(tryNonce(7)), reference(`${prefix}7`), `prefix ${length}, back to one digit`)
  }
})

test('a run of consecutive nonces agrees with Node', () => {
  const prefix = 'bic/rec block\nheight: 8\nprevious: ' + 'a'.repeat(64) + '\nminer: Asha\nnonce: '
  const tryNonce = createMiner(prefix)
  for (let nonce = 0; nonce < 3000; nonce++) {
    assert.equal(hexOf(tryNonce(nonce)), reference(prefix + nonce))
  }
})

test('difficulty is read off the hash the same way a person would count its zeros', () => {
  const tryNonce = createMiner('difficulty check: ')
  for (let nonce = 0; nonce < 20000; nonce++) {
    const H = tryNonce(nonce)
    const zeros = hexOf(H).match(/^0*/)[0].length
    for (let asked = 0; asked <= 5; asked++) {
      assert.equal(meetsDifficulty(H, asked), zeros >= asked, `nonce ${nonce}, ${asked} zeros`)
    }
  }
})
