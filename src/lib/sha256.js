// SHA-256 (FIPS 180-4), written out in plain JavaScript.
//
// Browsers have their own (crypto.subtle), but it only answers asynchronously and only on https, and it costs
// a promise per hash. The chain's hashes are shown all over the site, in components that render in one pass,
// and the miner tries a million hashes a second — both need a hash that is simply a function call.
//
// It is the real algorithm, not a look-alike: tests/unit/sha256.test.js holds it to Node's own implementation,
// and /chain checks it against the browser's in front of the visitor.
//
// No browser-only or Node-only code: it runs in the page, in the mining worker, at build time and in tests.

const K = new Int32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

const INITIAL = new Int32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
])

// The message schedule, reused by every call: nothing here runs on two threads at once.
const W = new Int32Array(64)

// Folds one 64-byte block of `bytes`, starting at `offset`, into the eight-word state `H`.
function compress(H, bytes, offset) {
  for (let i = 0; i < 16; i++) {
    const j = offset + i * 4
    W[i] = (bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]
  }
  for (let i = 16; i < 64; i++) {
    const a = W[i - 15]
    const b = W[i - 2]
    const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3)
    const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10)
    W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0
  }

  let a = H[0]
  let b = H[1]
  let c = H[2]
  let d = H[3]
  let e = H[4]
  let f = H[5]
  let g = H[6]
  let h = H[7]

  for (let i = 0; i < 64; i++) {
    const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
    const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0
    const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
    const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0
    h = g
    g = f
    f = e
    e = (d + t1) | 0
    d = c
    c = b
    b = a
    a = (t1 + t2) | 0
  }

  H[0] = (H[0] + a) | 0
  H[1] = (H[1] + b) | 0
  H[2] = (H[2] + c) | 0
  H[3] = (H[3] + d) | 0
  H[4] = (H[4] + e) | 0
  H[5] = (H[5] + f) | 0
  H[6] = (H[6] + g) | 0
  H[7] = (H[7] + h) | 0
}

// Ends a message that is `length` bytes long in total: the 0x80 marker straight after the last byte (at
// `end` in `buffer`), zeros, then the length in bits as the last eight bytes of the block.
function pad(buffer, end, blocks, length) {
  buffer.fill(0, end)
  buffer[end] = 0x80
  const last = blocks * 64
  const high = Math.floor(length / 0x20000000)
  const low = (length << 3) >>> 0
  buffer[last - 8] = high >>> 24
  buffer[last - 7] = high >>> 16
  buffer[last - 6] = high >>> 8
  buffer[last - 5] = high
  buffer[last - 4] = low >>> 24
  buffer[last - 3] = low >>> 16
  buffer[last - 2] = low >>> 8
  buffer[last - 1] = low
}

// The eight state words as the 64 hex characters everyone knows a hash by.
export const hexOf = (H) => Array.from(H, (word) => (word >>> 0).toString(16).padStart(8, '0')).join('')

const encoder = new TextEncoder()

export function sha256Bytes(bytes) {
  const blocks = Math.ceil((bytes.length + 9) / 64)
  const buffer = new Uint8Array(blocks * 64)
  buffer.set(bytes)
  pad(buffer, bytes.length, blocks, bytes.length)

  const H = new Int32Array(INITIAL)
  for (let offset = 0; offset < buffer.length; offset += 64) compress(H, buffer, offset)
  return H
}

// The hash of a piece of text (as UTF-8), in hex.
export const sha256 = (text) => hexOf(sha256Bytes(encoder.encode(text)))

// Does a hash start with `zeros` hex zeros? Read straight off the state, without writing the hex out: the
// miner asks this once per try. Up to eight zeros, which is far past what a browser will find.
export const meetsDifficulty = (H, zeros) => zeros <= 0 || H[0] >>> (32 - 4 * Math.min(zeros, 8)) === 0

// For mining: hashes `prefix` followed by a number written in decimal, over and over with a different number.
//
// Two things make the loop quick. Every whole 64-byte block of the prefix is folded in once, up front, and each
// try starts from that saved state rather than from the beginning. And nothing is allocated per try: the digits
// are written into one reused buffer, whose padding is only laid out again when the number grows a digit.
//
// Returns a function, nonce -> state. The state is reused too, so read it (hexOf, meetsDifficulty) before
// the next call.
export function createMiner(prefix) {
  const head = encoder.encode(prefix)
  const whole = head.length - (head.length % 64)
  const midstate = new Int32Array(INITIAL)
  for (let offset = 0; offset < whole; offset += 64) compress(midstate, head, offset)

  // What is left of the prefix (under 64 bytes), then up to 16 digits, the marker and the length: two blocks at most.
  const tail = head.length - whole
  const buffer = new Uint8Array(128)
  buffer.set(head.subarray(whole))

  const H = new Int32Array(8)
  let laidOutFor = 0
  let blocks = 1

  return function tryNonce(nonce) {
    let digits = 1
    for (let n = nonce; n >= 10; n = Math.floor(n / 10)) digits++

    if (digits !== laidOutFor) {
      laidOutFor = digits
      blocks = tail + digits + 9 <= 64 ? 1 : 2
      pad(buffer, tail + digits, blocks, head.length + digits)
    }

    let n = nonce
    for (let i = tail + digits - 1; i >= tail; i--) {
      buffer[i] = 48 + (n % 10)
      n = Math.floor(n / 10)
    }

    H.set(midstate)
    compress(H, buffer, 0)
    if (blocks === 2) compress(H, buffer, 64)
    return H
  }
}
