import { useState } from 'react'
import { motion } from 'motion/react'
import { INK, SLAM, SNAP, useReveal } from './core'

const TAGS = { div: motion.div, article: motion.article }

// A block hovers up-left on a long shadow, then slams down onto its resting hard shadow.
// The shadow's far corner never moves, so it reads as the block dropping onto the page.
// `hover`: once landed, pointing at the block picks it back up a little, and it slams down again on leave.
export default function Slam({
  as = 'div',
  size = 7,
  color = INK,
  lift = 8,
  hover = false,
  delay = 0,
  trigger = 'view',
  className = '',
  children,
  ...props
}) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  // The entrance delay must not also hold the block up when it drops back after a hover.
  const [settled, setSettled] = useState(false)
  const Tag = TAGS[as]
  const landed = { x: 0, y: 0, boxShadow: `${size}px ${size}px 0 ${color}` }
  const raised = { x: -lift, y: -lift, boxShadow: `${size + lift}px ${size + lift}px 0 ${color}` }
  const picked = { x: -4, y: -4, boxShadow: `${size + 4}px ${size + 4}px 0 ${color}`, transition: SNAP }

  return (
    <Tag
      ref={ref}
      className={className}
      initial={canAnimate ? raised : false}
      animate={!canAnimate || active ? landed : raised}
      whileHover={canAnimate && hover ? picked : undefined}
      transition={{ ...SLAM, delay: settled ? 0 : delay }}
      onAnimationComplete={hover && active ? () => setSettled(true) : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
