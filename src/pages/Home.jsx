import { Link } from 'react-router-dom'
import { Button, ChainRail, Chip, InkCTA, Ledger, SectionHeading, StatBar, TrackCards } from '../components/kit'
import EventRow from '../components/EventRow'
import { events, getFeaturedEvents, getUpcomingEvents } from '../data/events'
import { blockNo, shortHash } from '../lib/chain'

const stats = [
  { value: '12+', label: 'annual events' },
  { value: '60+', label: 'active members' },
  { value: '2+', label: 'years active' },
  { value: '15+', label: 'workshops' },
]

const pillars = [
  { title: 'Technical skills', body: 'Workshops, hackathons and live projects to make you industry-ready.' },
  { title: 'Strong community', body: 'A network of 60+ driven students who push each other to excel in Web3.' },
  { title: 'Decentralized future', body: 'Direct connection to the global blockchain and Web3 professional network.' },
]

function NextEvent({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="group block border-3 border-ink bg-bone p-6 shadow-ink">
      <p className="meta">next event · {blockNo(event.id)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Chip tone="pending">Upcoming</Chip>
        <Chip>{event.type}</Chip>
      </div>
      <h2 className="t-card mt-4 decoration-[3px] underline-offset-[5px] group-hover:underline">{event.title}</h2>
      <p className="mt-4 font-mono text-[12.5px]">
        {event.date}
        <br />
        {event.venue}
      </p>
      <p className="meta mt-5">{shortHash(event.slug)}</p>
    </Link>
  )
}

export default function Home() {
  const featured = getFeaturedEvents()
  const next = getUpcomingEvents()[0]

  return (
    <>
      <section className="border-b-3 border-ink">
        <div className="wrap pb-8 pt-8 md:pb-12 md:pt-14">
          <p className="meta mb-6">rajalakshmi engineering college · blockchain student chapter</p>
          <h1 className="t-hero">
            <span className="block">Build.</span>
            <span className="block">Innovate.</span>
            <span className="block">Decentralize.</span>
          </h1>
          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="t-lead max-w-[50ch]">
                Rajalakshmi Engineering College&apos;s premier blockchain student chapter, empowering the next
                generation of Web3 pioneers.
              </p>
              <div className="mt-8 flex flex-wrap gap-5">
                <Button to="/join">Join the club</Button>
                <Button to="/events" variant="bone">Explore events</Button>
              </div>
            </div>
            {next && <NextEvent event={next} />}
          </div>
          <ChainRail nodes={events.length} className="mt-10 md:mt-14" />
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <StatBar items={stats} highlight={1} />
          <div className="mt-14 md:mt-20">
            <SectionHeading
              eyebrow="about the chapter"
              title="One club. Endless opportunities."
              lead="Founded at Rajalakshmi Engineering College, our Blockchain Innovation Club accelerates the journey from curious student to Web3 professional."
            />
            <TrackCards items={pillars} />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap section">
          <SectionHeading
            eyebrow="what we run"
            title="Events that define us"
            action={<Button to="/events" variant="bone">View all events</Button>}
          />
          <Ledger head={['date', 'event', 'type · venue', 'status']}>
            {featured.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </Ledger>
        </div>
      </section>

      <InkCTA
        title="Ready to level up?"
        body="Join the Blockchain Innovation Club and unlock a global community of Web3 professionals, resources, and opportunities."
        aside={
          <div className="border-3 border-bone p-6">
            <p className="meta">faculty coordinator</p>
            <p className="t-card mt-3">Dr. N. Duraimurugan</p>
            <a
              href="mailto:duraimurugan.n@rajalakshmi.edu.in"
              className="mt-3 inline-block break-all font-mono text-[12.5px] underline decoration-2 underline-offset-4"
            >
              duraimurugan.n@rajalakshmi.edu.in
            </a>
          </div>
        }
      >
        <Button to="/join" variant="onInk">Become a member</Button>
      </InkCTA>
    </>
  )
}
