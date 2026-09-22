import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useCanAnimate } from './core'

const SPRING = { stiffness: 180, damping: 24, mass: 0.7 }

export default function MouseTracker() {
  const canAnimate = useCanAnimate()
  const [visible, setVisible] = useState(false)
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  useEffect(() => {
    if (!canAnimate) return undefined

    const trackPointer = (event) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }

    const hideTracker = () => setVisible(false)
    window.addEventListener('pointermove', trackPointer)
    window.addEventListener('pointerleave', hideTracker)

    return () => {
      window.removeEventListener('pointermove', trackPointer)
      window.removeEventListener('pointerleave', hideTracker)
    }
  }, [canAnimate, x, y])

  if (!canAnimate) return null

  return <motion.span aria-hidden="true" className="global-cursor" style={{ x, y, opacity: visible ? 1 : 0 }} />
}