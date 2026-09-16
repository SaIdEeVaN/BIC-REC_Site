// One IntersectionObserver for every scroll reveal on the page.
//
// Each `useReveal()` used to build its own observer, so a ledger page ran ~40 of them at once.
// They all ask the same question, so they share one: callbacks live in a WeakMap keyed by element,
// and an element is unobserved and forgotten the moment it fires. Reveals are once-only by design.

// Fire when the block is 12% visible AND 8% up from the bottom edge, so it lands where you can
// actually watch it. Observing at the edge (the old `amount: 0.25` with no margin) meant blocks
// finished animating in the bottom sliver of the screen, which is what read as "nothing happens".
const THRESHOLD = 0.12
const ROOT_MARGIN = '0px 0px -8% 0px'

let observer = null
const callbacks = new WeakMap()

function getObserver() {
  if (observer) return observer
  if (typeof IntersectionObserver === 'undefined') return null

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const callback = callbacks.get(entry.target)
        callbacks.delete(entry.target)
        observer.unobserve(entry.target)
        if (callback) callback()
      }
    },
    { root: null, threshold: THRESHOLD, rootMargin: ROOT_MARGIN },
  )

  return observer
}

// Calls `onReveal` once, the first time `element` scrolls far enough in. Returns an unsubscribe.
// Without IntersectionObserver there is nothing to wait for, so reveal on the next frame.
export function observeReveal(element, onReveal) {
  const active = getObserver()

  if (!active) {
    const frame = requestAnimationFrame(onReveal)
    return () => cancelAnimationFrame(frame)
  }

  callbacks.set(element, onReveal)
  active.observe(element)

  return () => {
    callbacks.delete(element)
    active.unobserve(element)
  }
}
