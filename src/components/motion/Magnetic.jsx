import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'
import { useCanAnimate } from './core'
import { trackPointer } from './pointerField'

const SPRING = { stiffness: 350, damping: 22, mass: 0.6 }

// Attract effect: the child leans toward the mouse pointer. The pull reaches `radius` past the element's
// own box and eases off across it, so the button starts reaching while the pointer is still on its way in
// and has let go by the time it is out of range — never a jump on and off at the edge. Touch and pen don't
// hover, so they are ignored (see pointerField, which also keeps the lean true as the page scrolls under a
// pointer that hasn't moved).
//
// The lean sits on an inner span so the measured box never moves. Measuring the element you are also
// translating feeds each frame's displacement back into the next reading: the lean ends up depending on
// which side the pointer came from rather than on where it is, and never reaches the strength it was asked
// for — dead centre used to read as a 1px lean rather than none.
export default function Magnetic({ children, strength = 0.3, max = 12, radius = 40, className = 'inline-block' }) {
  const canAnimate = useCanAnimate()
  const box = useRef(null)
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  useEffect(() => {
    if (!canAnimate) return

    const release = () => {
      x.set(0)
      y.set(0)
    }

    return trackPointer((point) => {
      const element = box.current
      if (!element) return
      // Nothing to follow — and nothing to measure for, so this costs no layout read while the page scrolls.
      if (!point) return release()

      const rect = element.getBoundingClientRect()
      if (rect.width === 0) return release()

      // How far outside the box the pointer is, on its furthest axis — 0 anywhere over the element itself.
      const beyond = Math.max(
        0,
        rect.left - point.x,
        point.x - rect.right,
        rect.top - point.y,
        point.y - rect.bottom,
      )
      const pull = beyond === 0 ? 1 : 1 - beyond / radius
      if (pull <= 0) return release()

      const lean = (from, centre) => Math.max(-max, Math.min(max, (from - centre) * strength)) * pull
      x.set(lean(point.x, rect.left + rect.width / 2))
      y.set(lean(point.y, rect.top + rect.height / 2))
    })
  }, [canAnimate, max, radius, strength, x, y])

  if (!canAnimate) return children

  return (
    <span ref={box} className={className}>
      <motion.span className="block" style={{ x, y }}>
        {children}
      </motion.span>
    </span>
  )
}
