import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { SNAP, useCanAnimate } from '../motion/core'
import { pad2 } from '../../lib/chain'

// The chain doesn't stop while you read the page. Height is derived from the clock rather than stored,
// so it's the same number on every machine, it only ever goes up, and there's nothing to keep in sync.
const GENESIS = Date.UTC(2025, 7, 1) // the club's first block: August 2025
const BLOCK_TIME = 12_000 // one block every 12s, the slot time this vocabulary borrows from
const WIDTH = 7 // digits held open, so the readout never changes width under the row beside it

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// An odometer wheel: ten digits stacked in a one-line window, shunted up to the one that's showing. A
// carry rolls the wheel the long way round, which is what a mechanical counter does.
//
// Every box in the clock is `leading-none` and exactly 1em tall, and the row centres them — so a digit
// sits on the same line as the words beside it. Baseline alignment can't do that here: a clipped box
// takes its baseline from its bottom edge, which would hang the whole wheel a descender too low.
function Digit({ value }) {
  const canAnimate = useCanAnimate()

  if (!canAnimate) return <span>{value}</span>

  return (
    <span className="inline-block h-[1em] overflow-hidden">
      <motion.span className="flex flex-col" animate={{ y: `-${value * 10}%` }} transition={SNAP}>
        {DIGITS.map((digit) => (
          <span key={digit} className="block h-[1em]">
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

// Decorative chrome that rewrites itself every second, so it's hidden from assistive tech rather than
// read out over and over — the line it sits in carries the head hash as text.
export default function BlockClock({ className = '' }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const elapsed = Math.max(now - GENESIS, 0)
  const height = String(Math.floor(elapsed / BLOCK_TIME)).padStart(WIDTH, '0')
  const since = Math.floor((elapsed % BLOCK_TIME) / 1000)

  return (
    <span aria-hidden="true" className={`inline-flex items-center leading-none ${className}`}>
      <span>block&nbsp;</span>
      {Array.from(height, (digit, i) => (
        <Digit key={i} value={Number(digit)} />
      ))}
      <span>&nbsp;· sealed {pad2(since)}s ago</span>
    </span>
  )
}
