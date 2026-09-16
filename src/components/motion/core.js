import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { observeReveal } from './revealObserver'

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

// One cadence for every staggered group on the site. Capped, because the 30th row of a ledger
// should not wait 2s for its turn — past a dozen items the stagger has already done its job.
const STAGGER_STEP = 0.045
const STAGGER_CAP = 12
export function stagger(index) {
  return Math.min(index, STAGGER_CAP) * STAGGER_STEP
}

export function useCanAnimate() {
  return !useReducedMotion()
}

// A container that hides its children with a clip (e.g. a ledger row) provides its own reveal state here,
// so animations inside it start with the container instead of waiting on an observer that can't see them.
export const RevealContext = createContext(null)

// Returns [ref, active, canAnimate]. Attach `ref` to an element that is NOT clipped or collapsed at rest —
// IntersectionObserver never reports an element hidden by its own clip-path or by a clipping ancestor.
export function useReveal({ trigger = 'view' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const parentActive = useContext(RevealContext)
  const canAnimate = useCanAnimate()

  // `trigger: 'mount'` and a clipping parent both settle the reveal without an observer;
  // reduced motion has nothing to wait for either. Only watch the element when it's the thing deciding.
  const watching = trigger === 'view' && parentActive == null && canAnimate && !inView

  useEffect(() => {
    if (!watching) return
    const element = ref.current
    if (!element) return
    return observeReveal(element, () => setInView(true))
  }, [watching])

  return [ref, trigger === 'mount' || (parentActive ?? inView), canAnimate]
}
