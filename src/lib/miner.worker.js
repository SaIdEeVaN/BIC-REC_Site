// The miner (/mine), on a thread of its own so the page stays responsive while it works.
//
// It is handed everything in the block except the nonce, and tries 0, 1, 2… until the block's hash starts with
// the zeros asked for. Starting from 0 rather than somewhere random makes the answer a fact about the block:
// the same name at the same difficulty always needs the same nonce, on any machine, and anyone can check it.
//
// A worker in a loop can't hear a message, so there is no "stop" to send: the page ends the search by
// terminating the worker.
import { createMiner, hexOf, meetsDifficulty } from './sha256.js'

// How often to report, in ms. Often enough for the readout to churn, seldom enough not to slow the search.
const REPORT_EVERY = 80
// The clock is only read once in this many tries; reading it every time would cost more than the hashing.
const CLOCK_EVERY = 0x1fff

self.onmessage = ({ data: { prefix, zeros } }) => {
  const tryNonce = createMiner(prefix)
  const started = performance.now()
  let reported = started

  for (let nonce = 0; ; nonce++) {
    const H = tryNonce(nonce)

    if (meetsDifficulty(H, zeros)) {
      self.postMessage({ found: true, nonce, hash: hexOf(H), tries: nonce + 1, ms: performance.now() - started })
      return
    }

    if ((nonce & CLOCK_EVERY) === CLOCK_EVERY) {
      const now = performance.now()
      if (now - reported >= REPORT_EVERY) {
        reported = now
        self.postMessage({ found: false, nonce, hash: hexOf(H), tries: nonce + 1, ms: now - started })
      }
    }
  }
}
