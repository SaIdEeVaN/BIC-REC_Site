import { createContext, useContext, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

// Motion language for DESIGN_SYSTEM.md: things shunt, slam, draw and decrypt. Nothing fades or blurs.

export const INK = '#14110E'
export const BONE = '#EDE6D8'
export const AMBER = '#D9A441'

// Sharp in-out: blocks shunt into place rather than drift.
export const EASE = [0.77, 0, 0.175, 1]
export const EASE_OUT = [0.16, 1, 0.3, 1]
// Stiff spring with a hint of overshoot: a block landing on its shadow.
export const SLAM = { type: 'spring', stiffness: 700, damping: 34, mass: 0.9 }
// No overshoot: sliding selection fills (nav, tabs).
export const SNAP = { type: 'spring', stiffness: 520, damping: 42 }

export function useCanAnimate() {
  return !useReducedMotion()
}

// A container that hides its children with a clip (e.g. a ledger row) provides its own reveal state here,
// so animations inside it start with the container instead of waiting on an observer that can't see them.
export const RevealContext = createContext(null)

// Returns [ref, active, canAnimate]. Attach `ref` to an element that is NOT clipped or collapsed at rest —
// IntersectionObserver never reports an element hidden by its own clip-path or by a clipping ancestor.
export function useReveal({ trigger = 'view', amount = 0.25 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  const parentActive = useContext(RevealContext)
  const canAnimate = useCanAnimate()
  return [ref, trigger === 'mount' || (parentActive ?? inView), canAnimate]
}
