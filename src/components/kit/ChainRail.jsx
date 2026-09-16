import { motion } from 'motion/react'
import { AMBER, BONE, EASE, INK, SLAM, useReveal } from '../motion/core'

const DRAW = 0.9

// The chain, drawn: one 3px rail, a 16px square per block with two diagonal branches; the last is the amber head.
// Animated: the rail draws left to right, each block slams in as the line reaches it, then a packet
// keeps travelling along the chain.
export default function ChainRail({ nodes = 6, delay = 0, className = '' }) {
  const [ref, active, canAnimate] = useReveal()
  const on = !canAnimate || active

  return (
    <div ref={ref} aria-hidden="true" className={`relative h-16 ${className}`}>
      <svg className="block h-16 w-full overflow-visible">
        <motion.line
          x1="0"
          y1="32"
          x2="100%"
          y2="32"
          stroke={INK}
          strokeWidth="3"
          initial={canAnimate ? { pathLength: 0 } : false}
          animate={{ pathLength: on ? 1 : 0 }}
          transition={{ duration: DRAW, ease: EASE, delay }}
        />
        {Array.from({ length: nodes }, (_, i) => {
          const at = (i + 0.5) / nodes
          return (
            <svg key={i} x={`${at * 100}%`} y="0" overflow="visible">
              <motion.g
                initial={canAnimate ? { scale: 0 } : false}
                animate={{ scale: on ? 1 : 0 }}
                transition={{ ...SLAM, delay: delay + at * DRAW }}
              >
                <line x1="-8" y1="24" x2="-21" y2="11" stroke={INK} strokeWidth="3" strokeLinecap="square" />
                <line x1="-8" y1="40" x2="-21" y2="53" stroke={INK} strokeWidth="3" strokeLinecap="square" />
                <rect
                  x="-8"
                  y="24"
                  width="16"
                  height="16"
                  fill={i === nodes - 1 ? AMBER : BONE}
                  stroke={INK}
                  strokeWidth="3"
                />
              </motion.g>
            </svg>
          )
        })}
      </svg>
      {canAnimate && on && (
        <motion.span
          className="absolute top-[27px] -ml-[5px] block h-[10px] w-[10px] bg-ink"
          initial={{ left: '0%', scale: 0 }}
          animate={{ left: '100%', scale: 1 }}
          transition={{
            left: { duration: 3.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.6, delay: delay + DRAW + 0.4 },
            // Appears only when it starts travelling, not parked at the start while the chain draws.
            scale: { duration: 0, delay: delay + DRAW + 0.4 },
          }}
        />
      )}
    </div>
  )
}
