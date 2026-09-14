import { useEffect, useState } from 'react'
import { animate } from 'motion/react'
import { EASE_OUT, useReveal } from './core'

// Number ticker: "500+" counts 0 → 500 once in view, keeping any prefix/suffix.
export default function CountUp({ value, duration = 1.4, delay = 0, className = '' }) {
  const match = String(value).match(/^(\D*)(\d+)(.*)$/)
  const hasNumber = match !== null
  const target = hasNumber ? Number(match[2]) : 0
  const [ref, active, canAnimate] = useReveal()
  const [current, setCurrent] = useState(canAnimate ? 0 : target)

  // Depend on primitives only: `match` is a new array every render, and each tick re-renders,
  // so depending on it would restart the count from 0 forever.
  useEffect(() => {
    if (!hasNumber || !canAnimate || !active) return
    const controls = animate(0, target, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => setCurrent(Math.round(v)),
    })
    return () => controls.stop()
  }, [hasNumber, canAnimate, active, target, duration, delay])

  if (!match) return value

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {match[1]}
        {current}
        {match[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
