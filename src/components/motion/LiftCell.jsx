import { forwardRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { EASE, INK, SNAP, stagger, useCanAnimate, useReveal } from './core'

// A cell in a `.cells` grid that gets picked up on hover: it shunts up-left off the grid onto a hard shadow.
// `shuffle`: when a filter reflows the grid, cells slide to their new slots, leavers shrink out and newcomers
// grow in. Render shuffling cells inside <AnimatePresence mode="popLayout" initial={false}> on a positioned list.
// Forwards its ref because popLayout needs the DOM node of each direct child.
//
// A static grid also carries the site's scroll reveal, staggered by `index`. A shuffling one does not:
// its `layout` animation measures cell positions, and a CSS `translate` offset would be measured with them.
const LiftCell = forwardRef(function LiftCell(
  { shuffle = false, index, className = '', children, ...props },
  ref,
) {
  const canAnimate = useCanAnimate()
  const [revealRef, revealed] = useReveal()
  const reveals = !shuffle

  // The cell needs one ref for the observer and one for the consumer (popLayout wants the node).
  const setRef = useCallback(
    (node) => {
      if (reveals) revealRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [reveals, revealRef, ref],
  )

  // `translate` (the reveal) and `transform` (the hover lift) are separate CSS properties, so the
  // two compose instead of fighting — but they share one `style` object and must be merged, not spread over.
  const style = {
    ...(canAnimate && { boxShadow: `0px 0px 0 ${INK}` }),
    ...(reveals && index != null && { transitionDelay: `${Math.round(stagger(index) * 1000)}ms` }),
  }

  const motionProps = canAnimate
    ? {
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

  const revealClass = reveals ? ` reveal${revealed ? ' reveal--in' : ''}` : ''

  return (
    <motion.li
      ref={setRef}
      className={`relative hover:z-10${revealClass} ${className}`}
      style={style}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.li>
  )
})

export default LiftCell
