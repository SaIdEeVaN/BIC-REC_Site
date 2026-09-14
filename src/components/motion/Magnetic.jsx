import { motion, useSpring } from 'motion/react'
import { useCanAnimate } from './core'

const SPRING = { stiffness: 350, damping: 22, mass: 0.6 }

// Attract effect: the child leans toward the mouse pointer (touch is ignored).
export default function Magnetic({ children, strength = 0.3, max = 12, className = 'inline-block' }) {
  const canAnimate = useCanAnimate()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  if (!canAnimate) return children

  const clamp = (v) => Math.max(-max, Math.min(max, v))

  return (
    <motion.span
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(clamp((e.clientX - rect.left - rect.width / 2) * strength))
        y.set(clamp((e.clientY - rect.top - rect.height / 2) * strength))
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}
