import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Button, ChainRail, Chip, InkCTA, Ledger, SectionHeading, StatBar, TrackCards } from '../components/kit'
import { EASE, Magnetic, Scramble, Slam, SplitText, Typewriter, Wipe, useCanAnimate } from '../components/motion'
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

const HERO_WORDS = ['Build.', 'Innovate.', 'Decentralize.']

const INSTAGRAM = 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=='

// Hero load sequence (seconds): eyebrow types 0 → words shunt up .15–.6 → lead unseals .7 →
// buttons drop .9 → next-event card slams 1.05 → chain draws and a packet starts travelling.

function Drop({ delay, children }) {
  const canAnimate = useCanAnimate()
  return (
    <motion.div
      style={{ originY: 0 }}
      initial={canAnimate ? { scaleY: 0 } : false}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function NextEvent({ event }) {
  return (
    <Slam trigger="mount" delay={1.05} className="border-3 border-ink bg-bone shadow-ink">
      <Link to={`/events/${event.id}`} className="group block p-6">
        <p className="meta">
          <Scramble text={`next event · ${blockNo(event.id)}`} trigger="mount" delay={1.2} />
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip tone="pending">
            <span aria-hidden="true" className="blink mr-1.5 inline-block h-[7px] w-[7px] bg-ink" />
            Upcoming
          </Chip>
          <Chip>{event.type}</Chip>
        </div>
        <h2 className="t-card mt-4 decoration-[3px] underline-offset-[5px] group-hover:underline">{event.title}</h2>
        <p className="mt-4 font-mono text-[12.5px]">
          {event.date}
          <br />
          {event.venue}
        </p>
        <p className="meta mt-5">
          <Scramble text={shortHash(event.slug)} trigger="mount" delay={1.35} />
        </p>
      </Link>
    </Slam>
  )
}

// Shown in the next-event slot when nothing is scheduled, so the hero never promotes a past event.
function NoUpcomingEvent() {
  const linkClass = 'text-[14px] font-extrabold uppercase underline decoration-[3px] underline-offset-[5px]'
  return (
    <Slam trigger="mount" delay={1.05} className="border-3 border-ink bg-bone p-6 shadow-ink">
      <p className="meta">
        <Scramble text="next event · not scheduled" trigger="mount" delay={1.2} />
      </p>
      <h2 className="t-card mt-5">Next event coming soon</h2>
      <p className="t-small mt-3">New workshops and hackathons are announced on Instagram first.</p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Follow @bic.rec
        </a>
        <Link to="/events" className={linkClass}>
          Past events
        </Link>
      </div>
    </Slam>
  )
}

export default function Home() {
  const featured = getFeaturedEvents()
  const next = getUpcomingEvents()[0]

  return (
    <>
      <section className="border-b-3 border-ink">
        <div className="wrap pb-8 pt-8 md:pb-12 md:pt-14">
          <p className="meta mb-6">
            <Typewriter text="rajalakshmi engineering college · blockchain student chapter" speed={0.02} />
          </p>
          <h1 className="t-hero">
            {HERO_WORDS.map((word, i) => (
              <span key={word} className="block">
                <SplitText text={word} delay={0.15 + i * 0.13} />
              </span>
            ))}
          </h1>
          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <Wipe trigger="mount" delay={0.7} className="w-fit max-w-[50ch]">
                <p className="t-lead">
                  Rajalakshmi Engineering College&apos;s premier blockchain student chapter, empowering the next
                  generation of Web3 pioneers.
                </p>
              </Wipe>
              <div className="mt-8 flex flex-wrap gap-5">
                <Drop delay={0.9}>
                  <Magnetic>
                    <Button to="/join">Join the club</Button>
                  </Magnetic>
                </Drop>
                <Drop delay={1}>
                  <Magnetic>
                    <Button to="/events" variant="bone">Explore events</Button>
                  </Magnetic>
                </Drop>
              </div>
            </div>
            {next ? <NextEvent event={next} /> : <NoUpcomingEvent />}
          </div>
          <ChainRail nodes={events.length} delay={0.5} className="mt-10 md:mt-14" />
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
            action={
              <Magnetic>
                <Button to="/events" variant="bone">View all events</Button>
              </Magnetic>
            }
          />
          <Ledger head={['date', 'event', 'type · venue', 'status']}>
            {featured.map((event, i) => (
              <EventRow key={event.id} event={event} index={i} />
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
