import { Link } from 'react-router-dom'

// Table as CSS grid: 150px 1fr 210px 160px with a 3px gap so the ink background draws the rules.
// Below md each row folds to: [date | status] / main / side.
const COLUMNS = 'md:grid-cols-[150px_1fr_210px_160px]'
const CELL = 'bg-bone p-4 md:p-5'
const STATUS_TONE = {
  pending: 'bg-amber',
  confirmed: 'bg-bone',
}

export function Ledger({ head, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-[3px] border-3 border-ink bg-ink ${className}`}>
      {head && (
        <div aria-hidden="true" className={`hidden gap-[3px] md:grid ${COLUMNS}`}>
          {head.map((label) => (
            <span key={label} className="px-5 py-2.5 font-mono text-[12px] font-medium lowercase text-bone">
              {label}
            </span>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

export function LedgerRow({ to, href, date, main, side, status, tone = 'confirmed' }) {
  const className = `row-link group grid grid-cols-[1fr_auto] gap-[3px] ${COLUMNS}`
  const cells = (
    <>
      <div className={`${CELL} order-1 font-mono text-[12.5px] font-medium`}>{date}</div>
      <div
        className={`${STATUS_TONE[tone]} order-2 p-4 font-mono text-[12.5px] font-medium uppercase md:order-4 md:p-5`}
      >
        {status}
      </div>
      <div className={`${CELL} order-3 col-span-2 md:order-2 md:col-span-1`}>{main}</div>
      <div className={`${CELL} order-4 col-span-2 md:order-3 md:col-span-1`}>{side}</div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {cells}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {cells}
      </a>
    )
  }

  return <div className={className}>{cells}</div>
}
