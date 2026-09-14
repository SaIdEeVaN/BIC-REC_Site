import { motion } from 'motion/react'
import { CountUp, EASE, useReveal } from '../motion'

const COLS = {
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}

// Equal cells split by 3px rules (the ink background shows through the gap); one cell is amber.
// Animated: figures count up, and the amber cell fills from the bottom once the numbers land.
export default function StatBar({ items, highlight = 0, className = '' }) {
  const [ref, active, canAnimate] = useReveal()

  return (
    <dl ref={ref} className={`grid gap-[3px] border-3 border-ink bg-ink ${COLS[items.length] ?? COLS[4]} ${className}`}>
      {items.map((item, i) => {
        const lit = i === highlight
        return (
          <div
            key={item.label}
            className={`relative flex flex-col-reverse justify-end gap-2 px-5 py-5 md:px-6 md:py-7 ${
              lit && !canAnimate ? 'bg-amber' : 'bg-bone'
            }`}
          >
            {lit && canAnimate && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom bg-amber"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: active ? 1 : 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.9 }}
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
