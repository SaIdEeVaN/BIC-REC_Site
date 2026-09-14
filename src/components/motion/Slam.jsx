import { motion } from 'motion/react'
import { INK, SLAM, useReveal } from './core'

const TAGS = { div: motion.div, article: motion.article, li: motion.li, section: motion.section }

// A block hovers up-left on a long shadow, then slams down onto its resting hard shadow.
// The shadow's far corner never moves, so it reads as the block dropping onto the page.
export default function Slam({
  as = 'div',
  size = 7,
  color = INK,
  lift = 8,
  delay = 0,
  trigger = 'view',
  className = '',
  children,
  ...props
}) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  const Tag = TAGS[as]
  const landed = { x: 0, y: 0, boxShadow: `${size}px ${size}px 0 ${color}` }
  const raised = { x: -lift, y: -lift, boxShadow: `${size + lift}px ${size + lift}px 0 ${color}` }

  return (
    <Tag
      ref={ref}
      className={className}
      initial={canAnimate ? raised : false}
      animate={!canAnimate || active ? landed : raised}
      transition={{ ...SLAM, delay }}
      {...props}
    >
      {children}
    </Tag>
  )
}
