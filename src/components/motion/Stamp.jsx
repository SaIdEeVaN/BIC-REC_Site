import { motion } from 'motion/react'
import { SLAM, useReveal } from './core'

// Rubber stamp for chips and statuses: absent until triggered, then brought down oversized and askew onto the page.
// Visibility switches hard (never opacity), so nothing fades in.
export default function Stamp({ delay = 0, trigger = 'view', className = '', children }) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  const raised = { visibility: 'hidden', scale: 1.8, rotate: -8 }
  const landed = { visibility: 'visible', scale: 1, rotate: 0 }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={canAnimate ? raised : false}
      animate={!canAnimate || active ? landed : raised}
      transition={{ ...SLAM, delay }}
    >
      {children}
    </motion.span>
  )
}
