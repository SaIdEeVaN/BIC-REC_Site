import { useMemo, useState } from 'react'
import { Button, ChainRail, EmptyState, Ledger, PageHeader, Tabs } from '../components/kit'
import EventRow from '../components/EventRow'
import ProveIt from '../components/ProveIt'
import { events, getUpcomingEvents } from '../data/events'
import { pad2 } from '../lib/chain'

// One tab per kind of event the club has actually run, so no tab is ever empty.
const FILTERS = ['All', ...new Set(events.map((e) => e.type))]

export default function Events() {
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(
    () => (filter === 'All' ? events : events.filter((e) => e.type === filter)),
    [filter]
  )
  const upcoming = getUpcomingEvents().length

  return (
    <>
      <PageHeader
        eyebrow="event ledger"
        title="Events"
        lead="Every event the Blockchain Innovation Club has run, from its inauguration in September 2025. Photos from them are in the gallery."
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
            <>
              {/* Keyed on the filter so the rail is rebuilt, not patched: the chain draws itself again,
                  one node per event still standing, every time the selection changes. */}
              <ChainRail key={filter} nodes={filtered.length} className="-mt-3 mb-4" />
              <Ledger head={['date', 'event', 'type · venue', 'status']}>
                {filtered.map((event, i) => (
                  <EventRow key={event.id} event={event} index={i} />
                ))}
              </Ledger>
            </>
          ) : (
            <EmptyState
              title="No events of this type yet"
              body="Nothing in this category is on the chain right now. The full list has everything that's coming up."
              action={<Button variant="onInk" onClick={() => setFilter('All')}>Show all events</Button>}
            />
          )}
        </div>
      </section>

      <ProveIt className="border-t-3 border-ink" />
    </>
  )
}
