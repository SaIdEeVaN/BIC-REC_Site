import { Link, useParams } from 'react-router-dom'
import { Button, Chip, EmptyState } from '../components/kit'
import { Desync, Reveal, Scramble, Slam, SplitText, Stamp } from '../components/motion'
import { boardMembers, getMemberBySlug } from '../data/members'
import { blockNo, shortHash } from '../lib/chain'
import { initials } from '../lib/initials'
import { photoFor } from '../lib/memberPhotos'

const linkClass = 'fill-up block border-3 border-ink px-4 py-3 text-[13.5px] font-extrabold uppercase'

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

// Steps through the roster in page order, so the board can be read straight through without going back.
function Neighbour({ member, direction }) {
  const label = direction < 0 ? '← previous' : 'next →'

  return (
    <Link to={`/team/board/${member.slug}`} className="row-link group block bg-bone p-5 md:p-6">
      <p className="meta">{label}</p>
      <p className="t-row mt-2 decoration-[3px] underline-offset-[5px] group-hover:underline">{member.name}</p>
      {member.role && <p className="meta mt-2">{member.role.toLowerCase()}</p>}
    </Link>
  )
}

export default function MemberDetail() {
  const { slug } = useParams()
  const member = getMemberBySlug(slug)

  if (!member) {
    return (
      <div className="wrap section">
        <EmptyState
          title="Member not found"
          body="There's nobody at this address. They may have left the club, or the link may be out of date."
          action={<Button variant="onInk" to="/team/board">Back to the board</Button>}
        />
      </div>
    )
  }

  const index = boardMembers.findIndex((m) => m.slug === member.slug)
  const previous = boardMembers[index - 1]
  const next = boardMembers[index + 1]
  const facts = [
    ['role', member.role],
    ['group', member.group],
    ['department', member.department],
  ].filter(([, value]) => Boolean(value))

  return (
    <>
      <header className="border-b-3 border-ink">
        <div className="wrap section">
          <Link
            to="/team/board"
            className="font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4"
          >
            ← back to the board
          </Link>
          <p className="meta mt-8">
            <Scramble
              trigger="mount"
              duration={1}
              text={`${blockNo(index + 1)} · ${shortHash(member.slug)} · sealed`}
            />
          </p>
          <h1 className="t-title t-title-fluid mt-4 max-w-[17ch]">
            <Desync text={member.name}>
              <SplitText text={member.name} delay={0.15} />
            </Desync>
          </h1>
          <div className="mt-7 flex flex-wrap gap-2">
            <Stamp trigger="mount" delay={0.6}>
              <Chip tone="pending">{member.role}</Chip>
            </Stamp>
            <Stamp trigger="mount" delay={0.68}>
              <Chip>{member.group}</Chip>
            </Stamp>
            {member.department && (
              <Stamp trigger="mount" delay={0.76}>
                <Chip>{member.department}</Chip>
              </Stamp>
            )}
          </div>
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
            <div className="grid gap-[3px] border-3 border-ink bg-ink md:grid-cols-2">
              {previous && <Neighbour member={previous} direction={-1} />}
              {next && <Neighbour member={next} direction={1} />}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
