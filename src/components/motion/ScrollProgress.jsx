import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

// Amber bar that fills the header's bottom rule as the page scrolls. Place inside a positioned header.
//
// Progress is derived from scrollY against the page's *current* height. Motion's own scrollYProgress is
// measured at mount, before a route's lazy chunk has rendered, which left the bar stuck full at the top of
// every long page. The height is remeasured when the document actually resizes rather than on every scroll
// event — reading scrollHeight per scroll forced a layout on every frame.
export default function ScrollProgress() {
  const { scrollY } = useScroll()
  const [scrollable, setScrollable] = useState(0)

  useEffect(() => {
    const measure = () => setScrollable(document.documentElement.scrollHeight - window.innerHeight)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const progress = useTransform(scrollY, (y) => (scrollable > 0 ? Math.min(y / scrollable, 1) : 0))
  // Damped: at a trackpad's scroll resolution an undamped bar twitches, and the spring also carries it
  // smoothly across the jump when a page's height changes under it.
  const damped = useSpring(progress, { stiffness: 220, damping: 32, restDelta: 0.001 })

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[3px] block h-[3px] origin-left bg-amber"
      style={{ scaleX: damped }}
    />
  )
}
