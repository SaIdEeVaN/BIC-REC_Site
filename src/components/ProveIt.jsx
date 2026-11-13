import { Link } from 'react-router-dom'
import { SectionHeading } from './kit'
import { LiftCell } from './motion'
import { blockNo, pad2 } from '../lib/chain'
import { blocks, head, nextHeight, short } from '../lib/ledger'

// The two things a visitor can do with the chain, as two doors: check it (/chain) and add to it (/mine).
// Built like <MeetUs>: on one of the two pages (`current`), that page's cell is inked and the section becomes
// the way across to the other.
const DOORS = [
  {
    key: 'chain',
    path: '/chain',
    meta: `${pad2(blocks.length)} blocks · head ${short(head.hash)}`,
    title: 'Verify the chain',
    body: 'Your browser recomputes every block’s hash from its record. Then change one record, and watch every block after it break.',
    go: 'check it →',
  },
  {
    key: 'mine',
    path: '/mine',
    meta: `${blockNo(nextHeight)} · not mined yet`,
    title: 'Mine a block',
    body: 'Proof of work, for real: pick how many zeros the hash must start with, and your machine searches for the number that gets there.',
    go: 'start mining →',
  },
]

export default function ProveIt({
  current,
  eyebrow = 'don’t trust, verify',
  title = 'The chain is real',
  lead = 'Every event on this site is a block, sealed with a real SHA-256 hash that covers the block before it. Nothing here asks to be taken on trust.',
  className,
}) {
  return (
    <section aria-label={title} className={className}>
      <div className="wrap section">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <ul className="cells grid lg:grid-cols-2">
          {DOORS.map((door, i) => {
            const here = door.key === current
            return (
              <LiftCell key={door.key} index={i} className={here ? 'on-ink bg-ink text-bone' : 'bg-bone'}>
                <Link to={door.path} aria-current={here ? 'page' : undefined} className="group flex h-full flex-col p-6 md:p-7">
                  <p className="meta">{door.meta}</p>
                  <h3 className="t-h3 mt-5 underline decoration-2 underline-offset-[6px] group-hover:decoration-[3px]">
                    {door.title}
                  </h3>
                  <p className="t-small mt-4 max-w-[52ch]">{door.body}</p>
                  <span className="meta mt-auto pt-6">{here ? 'you are here' : door.go}</span>
                </Link>
              </LiftCell>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
