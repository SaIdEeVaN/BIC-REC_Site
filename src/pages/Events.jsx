import { useMemo, useState } from 'react'
import { Button, EmptyState, Ledger, PageHeader, Tabs } from '../components/kit'
import EventRow from '../components/EventRow'
import { events } from '../data/events'
import { pad2 } from '../lib/chain'

const FILTERS = ['All', 'Workshop', 'Hackathon', 'Guest Lecture', 'Competition', 'Community Meetup']

export default function Events() {
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(
    () => (filter === 'All' ? events : events.filter((e) => e.type === filter)),
    [filter]
  )
  const upcoming = events.filter((e) => e.status === 'upcoming').length

  return (
    <>
      <PageHeader
        eyebrow="event ledger"
        title="Events"
        lead="Explore our curated collection of workshops, hackathons, and expert talks hosted by the Blockchain Innovation Club."
        aside={[
          ['blocks', pad2(events.length)],
          ['upcoming', pad2(upcoming)],
          ['sealed', pad2(events.length - upcoming)],
        ]}
      />

      <section>
        <div className="wrap section">
          <Tabs label="Filter events by type" options={FILTERS} value={filter} onChange={setFilter} className="mb-8" />
          {filtered.length > 0 ? (
            <Ledger head={['date', 'event', 'type · venue', 'status']}>
              {filtered.map((event, i) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}
            </Ledger>
          ) : (
            <EmptyState
              title="No events of this type yet"
              body="Nothing in this category is on the chain right now. The full list has everything that's coming up."
              action={<Button variant="onInk" onClick={() => setFilter('All')}>Show all events</Button>}
            />
          )}
        </div>
      </section>
    </>
  )
}
