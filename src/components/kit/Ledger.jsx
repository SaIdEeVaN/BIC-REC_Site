import { createContext, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { EASE, RevealContext, useReveal } from '../motion/core'

// Table as CSS grid: 150px 1fr 210px 160px with a 3px gap so the ink background draws the rules.
// Below the breakpoint each row folds to: [date | status] / main / side.
// The fixed columns take ~530px, so the four-column layout needs ~930px of the ledger's own width:
// `from="lg"` for full-width ledgers, `from="xl"` for a ledger inside a narrower column.
// Animated: each row "prints" left to right out of the ink as it scrolls in.
const LAYOUTS = {
  lg: {
    grid: 'lg:grid-cols-[150px_1fr_210px_160px]',
    head: 'lg:grid',
    status: 'lg:order-4',
    main: 'lg:order-2 lg:col-span-1',
    side: 'lg:order-3 lg:col-span-1',
  },
  xl: {
    grid: 'xl:grid-cols-[150px_1fr_210px_160px]',
    head: 'xl:grid',
    status: 'xl:order-4',
    main: 'xl:order-2 xl:col-span-1',
    side: 'xl:order-3 xl:col-span-1',
  },
}

const LayoutContext = createContext(LAYOUTS.lg)

const CELL = 'bg-bone p-4 md:p-5'
const STATUS_TONE = {
  pending: 'bg-amber',
  confirmed: 'bg-bone',
}

const MotionLink = motion.create(Link)

export function Ledger({ head, from = 'lg', children, className = '' }) {
  const layout = LAYOUTS[from]

  return (
    <LayoutContext.Provider value={layout}>
      <div className={`flex flex-col gap-[3px] border-3 border-ink bg-ink ${className}`}>
        {head && (
          <div aria-hidden="true" className={`hidden gap-[3px] ${layout.head} ${layout.grid}`}>
            {head.map((label) => (
              <span key={label} className="px-5 py-2.5 font-mono text-[12px] font-medium lowercase text-bone">
                {label}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </LayoutContext.Provider>
  )
}

export function LedgerRow({ to, href, date, main, side, status, tone = 'confirmed', index = 0 }) {
  const layout = useContext(LayoutContext)
  const [ref, active, canAnimate] = useReveal({ amount: 0.2 })
  const className = `row-link group grid grid-cols-[1fr_auto] gap-[3px] ${layout.grid}`
  const hidden = { clipPath: 'inset(0 100% 0 0)' }
  const reveal = canAnimate
    ? {
        initial: hidden,
        animate: active ? { clipPath: 'inset(0 0% 0 0)', transitionEnd: { clipPath: 'none' } } : hidden,
        transition: { duration: 0.55, ease: EASE, delay: Math.min(index, 8) * 0.07 },
      }
    : {}

  const cells = (
    <>
      <div className={`${CELL} order-1 font-mono text-[12.5px] font-medium`}>{date}</div>
      <div
        className={`${STATUS_TONE[tone]} order-2 p-4 font-mono text-[12.5px] font-medium uppercase md:p-5 ${layout.status}`}
      >
        {status}
      </div>
      <div className={`${CELL} order-3 col-span-2 ${layout.main}`}>{main}</div>
      <div className={`${CELL} order-4 col-span-2 ${layout.side}`}>{side}</div>
    </>
  )

  let row
  if (to) {
    row = (
      <MotionLink to={to} className={className} {...reveal}>
        {cells}
      </MotionLink>
    )
  } else if (href) {
    row = (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className={className} {...reveal}>
        {cells}
      </motion.a>
    )
  } else {
    row = (
      <motion.div className={className} {...reveal}>
        {cells}
      </motion.div>
    )
  }

  // Observe an unclipped wrapper (the row's own clip-path hides it from IntersectionObserver),
  // and hand the reveal state to animations inside the row (e.g. decrypting hashes).
  return (
    <div ref={ref}>
      <RevealContext.Provider value={active}>{row}</RevealContext.Provider>
    </div>
  )
}
