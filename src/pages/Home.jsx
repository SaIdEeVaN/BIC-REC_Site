import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll } from 'motion/react'
import { Button, ChainRail, Chip, InkCTA, Ledger, SectionHeading, StatBar, TrackCards } from '../components/kit'
import {
  Desync,
  Drift,
  EASE,
  Magnetic,
  Marquee,
  Mine,
  Reveal,
  Scramble,
  Slam,
  SplitText,
  Typewriter,
  Wipe,
  useCanAnimate,
} from '../components/motion'
import EventRow from '../components/EventRow'
import { events, getFeaturedEvents, getUpcomingEvents } from '../data/events'
import { facultyCoordinators } from '../data/members'
import { stats as clubStats } from '../data/achievements'
import { meshFacts } from '../lib/mesh'
import { blockNo, shortHash } from '../lib/chain'
import { CLUB_INSTAGRAM } from '../data/club'
import ChainField from '../components/ChainField'

// Read from the club's figures rather than written out again here — the two used to be separate lists
// and ended up contradicting each other. `events & workshops` is the roll-up of both counts, so it
// can't drift from the six cells on /achievements either.
const stats = [
  { value: `${clubStats.members}`, label: 'members' },
  { value: '1+', label: 'years active' },
  { value: `${clubStats.events + clubStats.workshops}`, label: 'events & workshops' },
  {
    value: `${clubStats.immersionPrograms}`,
    label: clubStats.immersionPrograms === 1 ? 'immersion program' : 'immersion programs',
  },
]

const pillars = [
  { title: 'Technical skills', body: 'Workshops, hackathons and live projects to make you industry-ready.' },
  { title: 'Strong community', body: 'A working force of 25 members who push each other to excel in Web3.' },
  { title: 'Decentralized future', body: 'Direct connection to the global blockchain and Web3 professional network.' },
]

const HERO_WORDS = ['Build.', 'Innovate.', 'Decentralize.']
const BAND_WORDS = ['Workshops', 'Hackathons', 'Guest lectures', 'Live projects']

// Hero load sequence (seconds): eyebrow types 0 → words shunt up .15–.6 → lead unseals .7 →
// buttons drop .9 → next-event card slams 1.05 → chain draws and a packet starts travelling.
// Scrolling away, the hero lines drift apart.

// Alternate hero lines slide left and right as the hero scrolls out, past the section's clipped edge.
// They share the hero's scroll progress rather than measuring their own, so the lines pull apart together.
function DriftLine({ progress, direction, children }) {
  return (
    <Drift as="span" progress={progress} x={direction * 140} className="block">
      {children}
    </Drift>
  )
}

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
        <h2 className="t-card mt-4 underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">{event.title}</h2>
        <p className="mt-4 font-mono text-[12.5px]">
          {event.date}
          <br />
          {event.venue}
        </p>
        {/* The block isn't sealed yet, so its hash is still being searched for rather than read out. */}
        <p className="meta mt-5">
          mining · <Mine text={shortHash(event.slug)} trigger="mount" delay={1.35} />
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
        <a href={CLUB_INSTAGRAM} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Follow @bic.rec
        </a>
        <Link to="/events" className={linkClass}>
          Past events
        </Link>
      </div>
    </Slam>
  )
}

const MESH_READOUT = [
  ['peers', String(meshFacts.nodes).padStart(2, '0')],
  ['links', String(meshFacts.links).padStart(2, '0')],
  ['full reach', `${String(meshFacts.hops).padStart(2, '0')} hops`],
]

// The club drawn as what it actually is: peers, not rows in a classroom. The heading forks on hover —
// a hover accent sitting over the entrance one, the way a track card is picked up after it has landed.
function Network() {
  const title = 'A network, not a classroom.'

  return (
    <section className="on-ink relative isolate border-b-3 border-bone bg-ink text-bone">
      <ChainField tone="ink" contained />
      <div className="wrap section">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
          <Reveal>
            <p className="meta mb-4">peer network</p>
            <h2 className="t-h2 max-w-[15ch]">
              <Desync text={title}>
                <SplitText text={title} trigger="view" />
              </Desync>
            </h2>
            <p className="t-lead mt-5 max-w-[52ch]">
              Twenty-five members on one shared record. A workshop runs on Tuesday, the notes have propagated
              by Wednesday, and the next build starts from where the last one finished.
            </p>
          </Reveal>
          <dl className="border-3 border-bone">
            {MESH_READOUT.map(([label, value], i) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-t-3 border-bone px-4 py-2.5 first:border-t-0"
              >
                <dt className="meta">{label}</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">
                  <Scramble text={value} delay={0.3 + i * 0.1} />
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 border-t-3 border-bone px-4 py-2.5">
              <dt className="meta">head</dt>
              <dd className="font-mono text-[12.5px] font-medium">
                <Mine text={shortHash('bic-rec')} delay={0.6} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const featured = getFeaturedEvents()
  const next = getUpcomingEvents()[0]
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  return (
    <>
      {/* overflow-x-clip: drifting hero lines slide past the page edge without making the page scroll sideways. */}
      <section ref={heroRef} className="overflow-x-clip border-b-3 border-ink">
        <div className="wrap pb-8 pt-8 md:pb-12 md:pt-14">
          <p className="meta mb-6">
            <Typewriter text="rajalakshmi engineering college · blockchain student chapter" speed={0.02} />
          </p>
          <h1 className="t-hero">
            {HERO_WORDS.map((word, i) => (
              <DriftLine key={word} progress={scrollYProgress} direction={i % 2 ? 1 : -1}>
                <SplitText text={word} delay={0.15 + i * 0.13} />
              </DriftLine>
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

      <Network />

      <Marquee words={BAND_WORDS} />

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
            <p className="meta">faculty coordinators</p>
            <ul className="mt-3 flex flex-col gap-4">
              {facultyCoordinators.map((coordinator) => (
                <li key={coordinator.name}>
                  <p className="t-card">{coordinator.name}</p>
                  <a
                    href={`mailto:${coordinator.email}`}
                    className="mt-1 inline-block break-all font-mono text-[12.5px] underline decoration-2 underline-offset-4"
                  >
                    {coordinator.email}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/team/board"
              className="mt-4 inline-block font-mono text-[12.5px] underline decoration-2 underline-offset-4"
            >
              meet the board →
            </Link>
          </div>
        }
      >
        <Button to="/join" variant="onInk">Become a member</Button>
      </InkCTA>
    </>
  )
}
