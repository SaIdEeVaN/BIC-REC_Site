import { Fragment } from 'react'
import { blockNo } from '../../lib/chain'

// Cards in a row joined by literal 36px x 3px connector bars. The last card overall is the head.
export default function TrackCards({ items, perRow = 3 }) {
  const rows = []
  for (let i = 0; i < items.length; i += perRow) rows.push(items.slice(i, i + perRow))
  const last = items.length - 1

  return (
    <div className="flex flex-col gap-9">
      {rows.map((row, r) => (
        <div key={r} className="flex flex-col lg:flex-row lg:items-stretch">
          {row.map((item, j) => {
            const index = r * perRow + j
            return (
              <Fragment key={item.title}>
                {j > 0 && (
                  <span
                    aria-hidden="true"
                    className="ml-8 block h-9 w-[3px] shrink-0 bg-ink lg:ml-0 lg:h-[3px] lg:w-9 lg:self-center"
                  />
                )}
                <article className="min-w-0 flex-1 border-3 border-ink bg-bone p-6 shadow-ink-5 lg:shadow-ink-6">
                  <p className="meta mb-5">
                    {blockNo(index + 1)}
                    {index === last && ' · head'}
                  </p>
                  <h3 className="t-card mb-3">{item.title}</h3>
                  <p className="t-small">{item.body}</p>
                </article>
              </Fragment>
            )
          })}
        </div>
      ))}
    </div>
  )
}
