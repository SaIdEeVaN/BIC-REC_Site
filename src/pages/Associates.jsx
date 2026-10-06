import { Button, SectionHeading } from '../components/kit'
import { pad2, shortHash } from '../lib/chain'
import { Desync, Marquee, Mine, Reveal, Scramble, SplitText, Typewriter, Wipe } from '../components/motion'
import MeetUs from '../components/MeetUs'
import MemberCell from '../components/MemberCell'
import { associateGroups, associateMembers } from '../data/members'
import { CLUB_INSTAGRAM, RECRUITMENT_RESULTS_OPEN, RECRUITMENT_RESULTS_URL } from '../data/club'

// Two states, switched by RECRUITMENT_RESULTS_OPEN in data/club.js:
// - closed: selections are still being finalised, so the page holds the slot ("Results coming soon").
// - open: results are published on the results site, so the page sends candidates there to check their own.
// Neither lists anyone by itself: the roster below the band (AssociateRoster) appears once data/associates.js
// has the new associates in it.
const STATES = {
  closed: {
    lead: 'Selections for the 2026–27 intake are still being finalised. Every new associate will be listed here the moment results are out.',
    status: ['selection', 'pending'],
    hero: ['Results', 'coming', 'soon'],
    body: 'Applications have closed and the intake is being finalised. Results are announced on Instagram first — every new associate will be listed here once they’re out.',
    band: ['Soon', 'Stay tuned', 'Watch this space', 'Any day now'],
  },
  open: {
    lead: 'The 2026–27 intake is closed and the results are live. Everyone who applied can check their own result.',
    status: ['results', 'live'],
    hero: ['Check', 'your', 'result'],
    body: 'Applied to BIC/REC this year? Sign in on the results page with the email you applied with, and use your roll number as the password.',
    band: ['Check your result', 'Email + roll number', 'Results are live', 'Welcome to the chain'],
  },
}

const TITLE = 'Associate members'

// The page's "about": who the associates are, below the results band.
const ABOUT =
  'Associates are the club’s newest members, selected through the 2026–27 recruitment. Each one joins one of the seven domains and works alongside its core team on events, builds, design and media: the first step towards leading a domain.'

// The page is one ink section rather than a bone <PageHeader> stacked on an ink block: the whole page
// is about one thing, and a rule across the middle of it split that in two. The header keeps
// PageHeader's layout and entrance — eyebrow types, title shunts up and forks on hover, lead unseals,
// the status decrypts — with its rules and curtain in bone, because it now sits on ink.
export default function Associates() {
  const open = RECRUITMENT_RESULTS_OPEN
  const { lead, status, hero, body, band } = STATES[open ? 'open' : 'closed']

  return (
    <>
      <section className="on-ink border-b-3 border-ink bg-ink text-bone">
        <div className="wrap section">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="meta mb-5">
                <Typewriter text="associate intake · 2026–27" />
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
                  results sealed · <Scramble text={shortHash('associates')} />
                </>
              ) : (
                <>
                  block #—— · mining <Mine text={shortHash('associates')} zeros={4} duration={2.4} />
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
                    <Button to="/team/core" variant="ghostOnInk">Meet the core team</Button>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee words={band} />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="about the associates" title="The newest blocks on the chain" lead={ABOUT} />
        </div>
      </section>

      {associateMembers.length > 0 && <AssociateRoster />}

      <MeetUs current="associates" />
    </>
  )
}

// Block numbers run on from one domain to the next, so the whole intake reads as a single chain.
let seats = 0
const groups = associateGroups.map((group) => {
  const start = seats
  seats += group.members.length
  return { ...group, start }
})

// The associates, as the core team is shown: grouped by domain in the club's order, a cell per member, each the way
// into their own page (/team/associates/<slug>) with their LinkedIn and Instagram.
function AssociateRoster() {
  return (
    <section aria-labelledby="associates-roster" className="border-b-3 border-ink">
      <div className="wrap section">
        <SectionHeading
          eyebrow={`the 2026–27 associates · ${associateMembers.length} members · ${groups.length} domains`}
          title="Meet the associates"
        />
        <div id="associates-roster" className="flex flex-col gap-10 md:gap-14">
          {groups.map((group) => (
            <div key={group.title}>
              <Reveal className="mb-5 flex items-baseline justify-between gap-4 border-b-3 border-ink pb-3">
                <h3 className="t-h3">{group.title}</h3>
                <p className="meta shrink-0">
                  {pad2(group.members.length)} {group.members.length === 1 ? 'associate' : 'associates'}
                </p>
              </Reveal>
              <ul className="cells grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.members.map((member, i) => (
                  <MemberCell key={member.slug} member={member} index={group.start + i} heading="h4" />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
