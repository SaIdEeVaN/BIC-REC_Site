import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Button, Chip, SectionHeading, Tabs } from '../components/kit'
import { blockNo, shortHash } from '../lib/chain'
import { Desync, LiftCell, Marquee, Mine, Reveal, Scramble, SplitText, Typewriter, Wipe } from '../components/motion'
import { CORE_TEAMS, coreMembers, roleOf } from '../data/coreMembers'
import { CLUB_INSTAGRAM, RECRUITMENT_RESULTS_OPEN, RECRUITMENT_RESULTS_URL } from '../data/club'

// Two states, switched by RECRUITMENT_RESULTS_OPEN in data/club.js:
// - closed: selections are still being finalised, so the page holds the slot ("Results coming soon").
// - open: results are published on the results site, so the page sends candidates there to check their own.
// Neither lists anyone by itself: the roster below the band (CoreRoster) appears once data/coreMembers.js has
// the new team in it.
const STATES = {
  closed: {
    lead: 'Selections for the core team are still being finalised. Everyone who makes it in will be listed here the moment results are out.',
    status: ['selection', 'pending'],
    hero: ['Results', 'coming', 'soon'],
    body: 'Applications have closed and the intake is being finalised. Results are announced on Instagram first — every core member will be listed here once they’re out.',
    band: ['Soon', 'Stay tuned', 'Watch this space', 'Any day now'],
  },
  open: {
    lead: 'The core team intake is closed and the results are live. Everyone who applied can check their own result.',
    status: ['results', 'live'],
    hero: ['Check', 'your', 'result'],
    body: 'Applied to the core team? Sign in on the results page with the email you applied with, and use your roll number as the password.',
    band: ['Check your result', 'Email + roll number', 'Results are live', 'Welcome to the chain'],
  },
}

const TITLE = 'Core members'

// The page is one ink section rather than a bone <PageHeader> stacked on an ink block: the whole page
// is about one thing, and a rule across the middle of it split that in two. The header keeps
// PageHeader's layout and entrance — eyebrow types, title shunts up and forks on hover, lead unseals,
// the status decrypts — with its rules and curtain in bone, because it now sits on ink.
export default function CoreMembers() {
  const open = RECRUITMENT_RESULTS_OPEN
  const { lead, status, hero, body, band } = STATES[open ? 'open' : 'closed']

  return (
    <>
      <section className="on-ink border-b-3 border-ink bg-ink text-bone">
        <div className="wrap section">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="meta mb-5">
                <Typewriter text="core team intake" />
              </p>
              <h1 className="t-title max-w-[13ch]">
                <Desync text={TITLE}>
                  <SplitText text={TITLE} delay={0.15} />
                </Desync>
              </h1>
              <Wipe color="bone" trigger="mount" delay={0.45} className="mt-6 w-fit max-w-[58ch]">
                <p className="t-lead">{lead}</p>
              </Wipe>
            </div>
            <dl className="border-3 border-bone">
              <div className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="meta">{status[0]}</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">
                  <Scramble text={status[1]} trigger="mount" delay={0.5} />
                </dd>
              </div>
            </dl>
          </div>

          {/* The one thing the page is about gets the hero treatment: three stacked lines at hero scale, the
              last one hollow. A future roster goes below it. */}
          <div className="mt-14 md:mt-20">
            {/* While results are pending the hash hasn't been found yet, so show the search; once they're
                published it's sealed, so it decrypts instead. */}
            <p className="meta">
              {open ? (
                <>
                  results sealed · <Scramble text={shortHash('core-members')} />
                </>
              ) : (
                <>
                  block #—— · mining <Mine text={shortHash('core-members')} zeros={4} duration={2.4} />
                </>
              )}
            </p>
            <h2 className="t-hero mt-7">
              <span className="block">
                <SplitText text={hero[0]} trigger="view" />
              </span>
              <span className="block text-amber">
                <SplitText text={hero[1]} trigger="view" delay={0.12} />
              </span>
              <span className="t-outline block">
                <SplitText text={hero[2]} trigger="view" delay={0.24} />
              </span>
            </h2>

            <Reveal className="mt-10" delay={420}>
              <p className="t-lead max-w-[46ch]">{body}</p>
              <div className="mt-9 flex flex-wrap gap-5">
                {open ? (
                  <>
                    <Button href={RECRUITMENT_RESULTS_URL} variant="onInk">Check your result</Button>
                    <Button href={CLUB_INSTAGRAM} variant="ghostOnInk">Follow @bic.rec</Button>
                  </>
                ) : (
                  <>
                    <Button href={CLUB_INSTAGRAM} variant="onInk">Follow @bic.rec</Button>
                    <Button to="/team/board" variant="ghostOnInk">Meet the board</Button>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee words={band} />

      {coreMembers.length > 0 && <CoreRoster />}
    </>
  )
}

const ALL = 'All'
// Only the teams that have someone in them, in the club's order.
const TEAMS = CORE_TEAMS.filter((team) => coreMembers.some((m) => m.team === team))

// The new core team: one cell per member, filtered by team. Members have no pages of their own (yet), so the
// cells are plain text, not links.
function CoreRoster() {
  const [filter, setFilter] = useState(ALL)
  const shown = filter === ALL ? coreMembers : coreMembers.filter((m) => m.team === filter)

  return (
    <section aria-labelledby="core-roster">
      <div className="wrap section">
        <SectionHeading
          eyebrow={`the new core team · ${coreMembers.length} members · ${TEAMS.length} teams`}
          title="Meet the core team"
        />
        <Tabs label="Filter the core team by team" options={[ALL, ...TEAMS]} value={filter} onChange={setFilter} />
        {/* Positioned so leaving cells can be popped out of the flow while the rest slide into place. Columns stay
            wide enough for the longest names (~15 letters at the card size) at every breakpoint. */}
        <ul id="core-roster" className="cells relative mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((member) => (
              <LiftCell key={`${member.team}-${member.name}`} shuffle className="flex flex-col bg-bone p-5">
                <p className="meta">{blockNo(coreMembers.indexOf(member) + 1)}</p>
                <h3 className="t-card mt-4">{member.name}</h3>
                {member.department && <p className="meta mt-2">{member.department.toLowerCase()}</p>}
                <div className="mt-auto pt-5">
                  <Chip tone={member.team === filter ? 'pending' : 'outline'}>{roleOf(member)}</Chip>
                </div>
              </LiftCell>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  )
}
