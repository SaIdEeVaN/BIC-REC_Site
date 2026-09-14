export default function PageHeader({ eyebrow, title, lead, aside, children }) {
  return (
    <header className="border-b-3 border-ink">
      <div className="wrap section grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
        <div>
          {eyebrow && <p className="meta mb-5">{eyebrow}</p>}
          <h1 className="t-title max-w-[13ch]">{title}</h1>
          {lead && <p className="t-lead mt-6 max-w-[58ch]">{lead}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-5">{children}</div>}
        </div>
        {aside && (
          <dl className="border-3 border-ink">
            {aside.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-t-3 border-ink px-4 py-2.5 first:border-t-0"
              >
                <dt className="meta">{label}</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
