import { motion } from 'motion/react'
import { CountUp, EASE, useReveal } from '../motion'

const COLS = {
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}

const FILL_DELAY = 0.9
const FILL_DURATION = 0.55

// Equal cells split by 3px rules (the ink background shows through the gap); one cell is amber.
// Animated: figures count up, and the amber cell fills from the bottom once the numbers land.
export default function StatBar({ items, highlight = 0, className = '' }) {
  const [ref, active, canAnimate] = useReveal()

  return (
    <dl
      ref={ref}
      className={`grid gap-[3px] border-3 border-ink bg-ink reveal${active ? ' reveal--in' : ''} ${
        COLS[items.length] ?? COLS[4]
      } ${className}`}
    >
      {items.map((item, i) => {
        const lit = i === highlight
        const filled = lit && (active || !canAnimate)
        return (
          <div
            key={item.label}
            className={`relative flex flex-col-reverse justify-end gap-2 px-5 py-5 md:px-6 md:py-7 ${
              lit && !canAnimate ? 'bg-amber' : 'bg-bone'
            } ${filled ? 'text-coal' : ''}`}
            // The figures turn coal once the amber is halfway up behind them — a change only the dark
            // theme can see, where they start out light on the dark cell.
            style={lit && canAnimate ? { transition: `color 0s linear ${FILL_DELAY + FILL_DURATION / 2}s` } : undefined}
          >
            {lit && canAnimate && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom bg-amber"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: active ? 1 : 0 }}
                transition={{ duration: FILL_DURATION, ease: EASE, delay: FILL_DELAY }}
              />
            )}
            <dt className="relative font-mono text-[12px] font-medium lowercase">{item.label}</dt>
            <dd className="t-stat relative">
              <CountUp value={item.value} delay={i * 0.08} />
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
