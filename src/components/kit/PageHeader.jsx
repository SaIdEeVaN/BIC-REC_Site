import { Children } from 'react'
import { Desync, Magnetic, Scramble, SplitText, Typewriter, Wipe } from '../motion'

// Entrance: eyebrow types, title words shunt up, lead unseals, aside values decrypt.
// Once landed, the title forks under a pointer — the same hover accent the footer wordmark carries, so
// every page that uses this header gets it without asking.
export default function PageHeader({ eyebrow, title, lead, aside, children }) {
  return (
    <header className="border-b-3 border-ink">
      {/* The 300px aside column only exists when there is an aside — otherwise it just starves the title. */}
      <div className={`wrap section grid gap-10 lg:items-end ${aside ? 'lg:grid-cols-[1fr_300px]' : ''}`}>
        <div>
          {eyebrow && (
            <p className="meta mb-5">
              <Typewriter text={eyebrow} />
            </p>
          )}
          <h1 className="t-title max-w-[13ch]">
            <Desync text={title}>
              <SplitText text={title} delay={0.15} />
            </Desync>
          </h1>
          {lead && (
            <Wipe trigger="mount" delay={0.45} className="mt-6 w-fit max-w-[58ch]">
              <p className="t-lead">{lead}</p>
            </Wipe>
          )}
          {children && (
            <div className="mt-9 flex flex-wrap gap-5">
              {Children.toArray(children).map((child) => (
                <Magnetic key={child.key}>{child}</Magnetic>
              ))}
            </div>
          )}
        </div>
        {aside && (
          <dl className="border-3 border-ink">
            {aside.map(([label, value], i) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-t-3 border-ink px-4 py-2.5 first:border-t-0"
              >
                <dt className="meta">{label}</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">
                  <Scramble text={value} trigger="mount" delay={0.5 + i * 0.1} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
