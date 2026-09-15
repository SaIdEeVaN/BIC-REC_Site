import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { EASE, INK, SNAP, useCanAnimate } from './core'

// A cell in a `.cells` grid that gets picked up on hover: it shunts up-left off the grid onto a hard shadow.
// `shuffle`: when a filter reflows the grid, cells slide to their new slots, leavers shrink out and newcomers
// grow in. Render shuffling cells inside <AnimatePresence mode="popLayout" initial={false}> on a positioned list.
// Forwards its ref because popLayout needs the DOM node of each direct child.
const LiftCell = forwardRef(function LiftCell({ shuffle = false, className = '', children, ...props }, ref) {
  const canAnimate = useCanAnimate()
  const motionProps = canAnimate
    ? {
        style: { boxShadow: `0px 0px 0 ${INK}` },
        whileHover: { x: -5, y: -5, boxShadow: `5px 5px 0 ${INK}` },
        transition: SNAP,
        ...(shuffle && {
          layout: 'position',
          initial: { scale: 0 },
          animate: { scale: 1 },
          exit: { scale: 0, transition: { duration: 0.25, ease: EASE } },
        }),
      }
    : {}

  return (
    <motion.li ref={ref} className={`relative hover:z-10 ${className}`} {...motionProps} {...props}>
      {children}
    </motion.li>
  )
})

export default LiftCell
