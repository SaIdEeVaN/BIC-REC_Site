import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCanAnimate } from './core'

const TAGS = { div: motion.div, span: motion.span }

// Scroll-linked drift: a block travels a little as the page scrolls past it, so stacked blocks separate
// instead of sliding by as one slab. `x`/`y` are the pixels travelled across the element's whole pass
// through the viewport.
//
// Pass `progress` to ride another element's scroll range — the hero lines all share the hero's, so they
// pull apart together. Leave it out and the block measures its own.
//
// Horizontal drift moves a block past its column, so the section holding one needs `overflow-x-clip`:
// otherwise the drift is what makes a page scroll sideways on a phone.
export default function Drift({ as = 'div', x = 0, y = 0, progress, className = '', children }) {
  const ref = useRef(null)
  const canAnimate = useCanAnimate()
  const own = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const source = progress ?? own.scrollYProgress
  const dx = useTransform(source, [0, 1], [0, x])
  const dy = useTransform(source, [0, 1], [0, y])
  const Tag = TAGS[as] ?? motion.div

  return (
    <Tag ref={ref} className={className} style={canAnimate ? { x: dx, y: dy } : undefined}>
      {children}
    </Tag>
  )
}
