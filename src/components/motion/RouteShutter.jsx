import { motion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { EASE, useCanAnimate } from './core'

// Page transition: an ink shutter covers the screen on navigation and retracts upward.
// Skipped on first load (location.key === 'default'), where the page runs its own entrance.
export default function RouteShutter() {
  const location = useLocation()
  const canAnimate = useCanAnimate()

  if (!canAnimate || location.key === 'default') return null

  return (
    <motion.div
      key={location.key}
      aria-hidden="true"
      className="on-ink pointer-events-none fixed inset-0 z-[70] origin-top border-b-[6px] border-amber bg-ink"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
    />
  )
}
