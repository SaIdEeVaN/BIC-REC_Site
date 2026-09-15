import { Fragment, useState } from 'react'
import { motion } from 'motion/react'
import { blockNo } from '../../lib/chain'
import { EASE, Scramble, Slam, useReveal } from '../motion'

// Connector bar: reveals from its top-left corner, so it draws across on desktop and down on mobile.
function Connector({ delay }) {
  const [ref, active, canAnimate] = useReveal({ amount: 0.5 })
  const hidden = { clipPath: 'inset(0 100% 100% 0)' }
  const shown = { clipPath: 'inset(0 0% 0% 0)' }

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className="ml-8 block h-9 w-[3px] shrink-0 bg-ink lg:ml-0 lg:h-[3px] lg:w-9 lg:self-center"
      initial={canAnimate ? hidden : false}
      animate={!canAnimate || active ? shown : hidden}
      transition={{ duration: 0.35, ease: EASE, delay }}
    />
  )
}

// Hovering a card picks the block up off the page and re-decrypts its block number.
function TrackCard({ item, eyebrow, delay }) {
  const [replay, setReplay] = useState(0)

  return (
    <Slam
      as="article"
      size={6}
      delay={delay}
      hover
      onHoverStart={() => setReplay((n) => n + 1)}
      className="min-w-0 flex-1 border-3 border-ink bg-bone p-6 shadow-ink-5 lg:shadow-ink-6"
    >
      <p className="meta mb-5">
        <Scramble text={eyebrow} delay={delay + 0.15} replay={replay} />
      </p>
      <h3 className="t-card mb-3">{item.title}</h3>
      <p className="t-small">{item.body}</p>
    </Slam>
  )
}

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
            const delay = j * 0.14
            return (
              <Fragment key={item.title}>
                {j > 0 && <Connector delay={delay - 0.08} />}
                <TrackCard
                  item={item}
                  delay={delay}
                  eyebrow={`${blockNo(index + 1)}${index === last ? ' · head' : ''}`}
                />
              </Fragment>
            )
          })}
        </div>
      ))}
    </div>
  )
}
