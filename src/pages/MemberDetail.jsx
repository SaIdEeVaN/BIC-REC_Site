import { Link, Navigate, useParams } from 'react-router-dom'
import { Button, EmptyState } from '../components/kit'
import { Desync, Reveal, Scramble, Slam, SplitText } from '../components/motion'
import { associateMembers, boardMembers, coreTeamMembers, getMemberBySlug, memberPath } from '../data/members'
import { blockNo, shortHash } from '../lib/chain'
import { initials } from '../lib/initials'
import { photoFor } from '../lib/memberPhotos'

const linkClass = 'fill-up block border-3 border-ink px-4 py-3 text-[13.5px] font-extrabold uppercase'

// Board members, core members and associates each have their own pages, and step through their own team only.
const TEAMS = {
  board: { path: '/team/board', name: 'the board', roster: boardMembers },
  core: { path: '/team/core', name: 'the core team', roster: coreTeamMembers },
  associates: { path: '/team/associates', name: 'the associates', roster: associateMembers },
}

// A member's own block. The portrait panel is a square either way: their photo once one is dropped into
// src/assets/members, their initials on ink until then — the roster can be filled in one face at a time.
function Portrait({ member }) {
  const photo = photoFor(member.slug)

  return (
    <Slam className="border-3 border-ink bg-ink shadow-ink">
      <div className="aspect-square w-full">
        {photo ? (
          <img src={photo} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span aria-hidden="true" className="text-[88px] font-black leading-none tracking-[-.05em] text-bone">
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>
    </Slam>
  )
}

// Steps through the team in page order, so it can be read straight through without going back.
function Neighbour({ member, direction }) {
  const label = direction < 0 ? '← previous' : 'next →'

  return (
    <Link to={memberPath(member)} className="row-link group block bg-bone p-5 md:p-6">
      <p className="meta">{label}</p>
      <p className="t-row mt-2 underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">{member.name}</p>
      {member.role && <p className="meta mt-2">{member.role.toLowerCase()}</p>}
    </Link>
  )
}

// `team`: which address this is ('board' for /team/board/:slug, 'core' for /team/core/:slug, 'associates' for
// /team/associates/:slug).
export default function MemberDetail({ team = 'board' }) {
  const { slug } = useParams()
  const member = getMemberBySlug(slug)
  const home = TEAMS[team]

  if (!member) {
    return (
      <div className="wrap section">
        <EmptyState
          title="Member not found"
          body="There's nobody at this address. They may have left the club, or the link may be out of date."
          action={<Button variant="onInk" to={home.path}>Back to {home.name}</Button>}
        />
      </div>
    )
  }

  // Core members' pages used to live under /team/board; an old link lands on the right page.
  if (member.team !== team) return <Navigate to={memberPath(member)} replace />

  const roster = home.roster
  const index = roster.findIndex((m) => m.slug === member.slug)
  const previous = roster[index - 1]
  const next = roster[index + 1]
  // An associate's group is their domain, which their role ("Event Associate") already says.
  const facts = [
    ['role', member.role],
    ['group', member.team === 'associates' ? null : member.group],
    ['department', member.department],
  ].filter(([, value]) => Boolean(value))

  return (
    <>
      <header className="border-b-3 border-ink">
        <div className="wrap section">
          <Link
            to={home.path}
            className="font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4"
          >
            ← back to {home.name}
          </Link>
          <p className="meta mt-8">
            <Scramble
              trigger="mount"
              duration={1}
              text={`${blockNo(index + 1)} · ${shortHash(member.slug)} · sealed`}
            />
          </p>
          {/* Role, group and department are stated once, in the details panel below — they used to be
              stamped here as chips as well, which said everything twice. */}
          <h1 className="t-title t-title-fluid mt-4 max-w-[17ch]">
            <Desync text={member.name}>
              <SplitText text={member.name} delay={0.15} />
            </Desync>
          </h1>
        </div>
      </header>

      <section>
        {/* The details column is capped rather than fluid: three short rows and two links stretched
            across a 1280px page read as a table with nothing in it. */}
        <div className="wrap section grid gap-10 lg:grid-cols-[340px_minmax(0,460px)] lg:items-start">
          <Portrait member={member} />

          <div>
            <Reveal>
              <dl className="border-3 border-ink">
                {facts.map(([label, value]) => (
                  <div key={label} className="border-t-3 border-ink px-4 py-3 first:border-t-0">
                    <dt className="meta">{label}</dt>
                    <dd className="mt-1 text-[15px] font-bold">{value}</dd>
                  </div>
                ))}
                {member.email && (
                  <div className="border-t-3 border-ink px-4 py-3">
                    <dt className="meta">email</dt>
                    {/* College addresses run past 45 characters, so they break anywhere rather than
                        pushing the column open. Same treatment as the faculty addresses. */}
                    <dd className="mt-1">
                      <a
                        href={`mailto:${member.email}`}
                        className="break-all font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4"
                      >
                        {member.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>

            {(member.linkedin || member.instagram) && (
              <Reveal className="mt-9" delay={120}>
                <h2 className="meta">find them</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Instagram ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {(previous || next) && (
        <section className="border-t-3 border-ink">
          <div className="wrap section">
            {/* Two columns only when there are two neighbours. The first and last member of the roster
                have one, and a half-filled two-column grid leaves the ink background showing through
                the empty cell as a black slab beside it. */}
            <div
              className={`grid gap-[3px] border-3 border-ink bg-ink ${previous && next ? 'md:grid-cols-2' : ''}`}
            >
              {previous && <Neighbour member={previous} direction={-1} />}
              {next && <Neighbour member={next} direction={1} />}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
