import { Chip, LedgerRow } from './kit'
import { Scramble } from './motion'
import { blockNo } from '../lib/chain'
import { blockOf, short } from '../lib/ledger'
import { isUpcoming } from '../data/events'

export default function EventRow({ event, index = 0 }) {
  const upcoming = isUpcoming(event)

  return (
    <LedgerRow
      to={`/events/${event.id}`}
      tone={upcoming ? 'pending' : 'confirmed'}
      index={index}
      date={
        <>
          <span className="block">{event.date}</span>
          <span className="meta mt-1 block">
            <Scramble text={blockNo(event.id)} delay={index * 0.07 + 0.2} />
          </span>
        </>
      }
      main={
        <>
          <h3 className="t-row underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">{event.title}</h3>
          <p className="t-small mt-2">{event.description}</p>
        </>
      }
      side={
        <>
          <Chip>{event.type}</Chip>
          {event.venue && <p className="mt-3 font-mono text-[12.5px]">{event.venue}</p>}
        </>
      }
      status={
        <>
          <span className="block">
            {upcoming && <span aria-hidden="true" className="blink mr-2 inline-block h-2 w-2 bg-coal align-middle" />}
            {upcoming ? 'Upcoming' : 'Sealed'}
          </span>
          <span className={`meta mt-2 block ${upcoming ? 'text-coal' : ''}`}>
            <Scramble text={short(blockOf(event).hash)} delay={index * 0.07 + 0.3} />
          </span>
        </>
      }
    />
  )
}
