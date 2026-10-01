import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useCanAnimate } from './core'

// Wraps v into [min, max), so the band can loop forever in either direction.
const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Run({ words }) {
  return (
    <p className="flex shrink-0 items-center">
      {[...words, ...words, ...words].map((word, i) => (
        <span key={i} className="flex items-center">
          <span className={i % 2 ? 't-outline' : ''}>{word}</span>
          <span className="mx-[0.3em] inline-block h-[0.3em] w-[0.3em] shrink-0 bg-amber" />
        </span>
      ))}
    </p>
  )
}

// Kinetic band: huge caps words run sideways forever on an ink strip. Scrolling down pushes the band faster,
// scrolling up throws it into reverse. Two identical runs shifted by exactly one run make the loop seamless.
// `speed` is the share of both runs (in %) travelled per second at rest. Static and clipped under reduced motion.
export default function Marquee({ words, speed = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const canAnimate = useCanAnimate()
  const offset = useMotionValue(0)
  const direction = useRef(-1)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const x = useTransform(offset, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (!canAnimate || !inView) return
    const b = boost.get()
    if (b > 0) direction.current = -1
    else if (b < 0) direction.current = 1
    // Cap the frame step so returning to a background tab doesn't jump the band.
    const step = Math.min(delta, 50) / 1000
    offset.set(offset.get() + direction.current * speed * step * (1 + Math.abs(b)))
  })

  return (
    <div ref={ref} aria-hidden="true" className="on-ink overflow-hidden whitespace-nowrap bg-ink py-4 text-bone md:py-6">
      <motion.div className="t-band flex w-max" style={canAnimate ? { x } : undefined}>
        <Run words={words} />
        <Run words={words} />
      </motion.div>
    </div>
  )
}
