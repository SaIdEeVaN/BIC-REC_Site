const COLS = {
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}

// Equal cells split by 3px rules (the ink background shows through the gap); one cell is amber.
export default function StatBar({ items, highlight = 0, className = '' }) {
  return (
    <dl className={`grid gap-[3px] border-3 border-ink bg-ink ${COLS[items.length] ?? COLS[4]} ${className}`}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-col-reverse justify-end gap-2 px-5 py-5 md:px-6 md:py-7 ${
            i === highlight ? 'bg-amber' : 'bg-bone'
          }`}
        >
          <dt className="font-mono text-[12px] font-medium lowercase">{item.label}</dt>
          <dd className="t-stat">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
