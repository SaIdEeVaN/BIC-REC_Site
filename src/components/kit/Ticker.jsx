import { motion } from 'motion/react'
import { isUpcoming } from '../../data/events'
import { blockNo, sealedDate } from '../../lib/chain'
import { blocks, short } from '../../lib/ledger'
import { useCanAnimate } from '../motion/core'

// The chain itself, block by block: each entry is a block's real hash (lib/ledger.js).
const entries = blocks.map(
  ({ event, height, hash }) =>
    `${blockNo(height)} · ${short(hash)} · ${isUpcoming(event) ? 'pending' : `sealed ${sealedDate(event.date)}`}`
)

function Run() {
  return (
    <p className="flex shrink-0">
      {[...entries, ...entries].map((entry, i) => (
        <span key={i} className="mr-10">
          {entry}
        </span>
      ))}
    </p>
  )
}

// Header ticker: an endless marquee of the chain (two identical runs, shifted by exactly one run).
// Static and clipped when reduced motion is requested.
export default function Ticker() {
  const canAnimate = useCanAnimate()

  return (
    <div aria-hidden="true" className="on-ink overflow-hidden whitespace-nowrap bg-ink py-[7px] text-bone">
      <motion.div
        className="flex w-max px-4 font-mono text-[12px] leading-none md:px-[44px]"
        animate={canAnimate ? { x: ['0%', '-50%'] } : undefined}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      >
        <Run />
        <Run />
      </motion.div>
    </div>
  )
}
