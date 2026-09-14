import { motion, useScroll, useTransform } from 'motion/react'

// Amber bar that fills the header's bottom rule as the page scrolls. Place inside a positioned header.
// Progress is derived from scrollY and the *current* page height on every scroll: `scrollYProgress` is
// measured once, and pages lazy-load taller after that, which left the bar stuck full at the top.
export default function ScrollProgress() {
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, (y) => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    return scrollable > 0 ? Math.min(y / scrollable, 1) : 0
  })

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[3px] block h-[3px] origin-left bg-amber"
      style={{ scaleX: progress }}
    />
  )
}
