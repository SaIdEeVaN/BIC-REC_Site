import { motion } from 'motion/react'
import { EASE, useReveal } from './core'

const COLORS = { ink: 'bg-ink', bone: 'bg-bone' }

// "Unsealing": content starts under a solid block that shunts off to the right. Nothing fades.
export default function Wipe({ children, color = 'ink', delay = 0, trigger = 'view', className = '' }) {
  const [ref, active, canAnimate] = useReveal({ trigger })

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      {canAnimate && (
        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 origin-right ${COLORS[color]}`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: active ? 0 : 1 }}
          transition={{ duration: 0.7, ease: EASE, delay }}
        />
      )}
    </div>
  )
}
