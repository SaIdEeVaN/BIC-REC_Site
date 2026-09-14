import { Chip, LedgerRow } from './kit'
import { blockNo, shortHash } from '../lib/chain'

export default function EventRow({ event }) {
  const upcoming = event.status === 'upcoming'

  return (
    <LedgerRow
      to={`/events/${event.id}`}
      tone={upcoming ? 'pending' : 'confirmed'}
      date={
        <>
          <span className="block">{event.date}</span>
          <span className="meta mt-1 block">{blockNo(event.id)}</span>
        </>
      }
      main={
        <>
          <h3 className="t-row decoration-[3px] underline-offset-[5px] group-hover:underline">{event.title}</h3>
          <p className="t-small mt-2">{event.description}</p>
        </>
      }
      side={
        <>
          <Chip>{event.type}</Chip>
          <p className="mt-3 font-mono text-[12.5px]">{event.venue}</p>
        </>
      }
      status={
        <>
          <span className="block">{upcoming ? 'Upcoming' : 'Sealed'}</span>
          <span className={`meta mt-2 block ${upcoming ? 'text-ink' : ''}`}>{shortHash(event.slug)}</span>
        </>
      }
    />
  )
}
