import { STAGGER_CAP, STAGGER_STEP, useReveal } from './core'

const TAGS = { div: 'div', li: 'li', section: 'section', article: 'article', p: 'p', tr: 'tr' }

// The default scroll reveal: a block shunts up into place out of a 26px drop, with a hint of
// overshoot so it lands rather than drifts. No opacity — per DESIGN_SYSTEM.md nothing fades.
//
// Deliberately CSS rather than Motion: this runs on almost every block on the site, and a class
// toggle driving `translate` stays on the compositor. Springing dozens of these in JS is what made
// scrolling the ledger pages stutter.
//
// The offset is downward, so a pending block always sits further from the one above it than it will
// at rest — blocks never overlap mid-flight, which matters with 3px rules and hard shadows.
export default function Reveal({ as = 'div', index, delay = 0, className = '', children, ...props }) {
  const [ref, active] = useReveal()
  const Tag = TAGS[as] ?? 'div'

  // `index` is the shorthand for "this is item N of a staggered group"; `delay` is an explicit offset.
  const ms = (index == null ? 0 : Math.min(index, STAGGER_CAP) * STAGGER_STEP * 1000) + delay

  return (
    <Tag
      ref={ref}
      className={`reveal${active ? ' reveal--in' : ''}${className ? ` ${className}` : ''}`}
      style={ms ? { transitionDelay: `${Math.round(ms)}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
