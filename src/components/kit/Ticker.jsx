import { events } from '../../data/events'
import { blockNo, sealedDate, shortHash } from '../../lib/chain'

const entries = events.map(
  (e) =>
    `${blockNo(e.id)} · ${shortHash(e.slug)} · ${e.status === 'upcoming' ? 'pending' : `sealed ${sealedDate(e.date)}`}`
)

// Header ticker: repeated and clipped, never animated.
export default function Ticker() {
  return (
    <div aria-hidden="true" className="overflow-hidden whitespace-nowrap bg-ink py-[7px] text-bone">
      <p className="px-4 font-mono text-[12px] leading-none md:px-[44px]">
        {[...entries, ...entries, ...entries].map((entry, i) => (
          <span key={i} className="mr-10">
            {entry}
          </span>
        ))}
      </p>
    </div>
  )
}
