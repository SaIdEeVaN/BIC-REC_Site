import { motion } from 'motion/react'
import { EASE, useReveal } from '../motion/core'
import { pad2 } from '../../lib/chain'

// Six, the confirmation depth this vocabulary borrows from.
const SLOTS = 6

// Depth: how many blocks have been sealed on top of this one. Equal cells split by 3px rules — the stat
// bar's shape at row scale — filling left to right as the strip reveals, one cell at a time.
//
// A block with nothing built on it yet reads 00/06 and stays bone, which is the honest answer for an
// event that hasn't happened: nothing has confirmed it.
export default function Confirmations({ count, of = SLOTS, label = 'confirmations', className = '' }) {
  const [ref, active, canAnimate] = useReveal()
  const filled = Math.max(0, Math.min(count, of))

  return (
    <div ref={ref} className={className}>
      <div className="flex gap-[3px] border-3 border-ink bg-ink">
        {Array.from({ length: of }, (_, i) => {
          const lit = i < filled
          return (
            <div key={i} className={`relative h-5 flex-1 ${lit && !canAnimate ? 'bg-amber' : 'bg-bone'}`}>
              {lit && canAnimate && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left bg-amber"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={{ duration: 0.28, ease: EASE, delay: 0.1 + i * 0.09 }}
                />
              )}
            </div>
          )
        })}
      </div>
      <p className="meta mt-2">
        {pad2(filled)}/{pad2(of)} {label}
      </p>
    </div>
  )
}
