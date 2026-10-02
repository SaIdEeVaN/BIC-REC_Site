import { Link } from 'react-router-dom'
import { SectionHeading } from './kit'
import { LiftCell } from './motion'
import { RECRUITMENT_RESULTS_OPEN } from '../data/club'
import { MEMBER_TEAMS } from '../data/teams'
import { pad2 } from '../lib/chain'

// Until the associates are listed, their cell says where the intake stands instead of "00 members".
function countLabel(team) {
  if (team.count > 0) return `${pad2(team.count)} members`
  return RECRUITMENT_RESULTS_OPEN ? 'results are live' : 'results soon'
}

// "Meet us": one cell per team, each the way into that team's page. On a team's own page (`current`), its cell
// is inked and marked as the current page, so the section doubles as a switcher between the three.
// `className`: for pages that need a rule above the section.
export default function MeetUs({ current, eyebrow = 'the people behind the club', title = 'Meet us', lead, className }) {
  return (
    <section aria-label={title} className={className}>
      <div className="wrap section">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <ul className="cells grid lg:grid-cols-3">
          {MEMBER_TEAMS.map((team, i) => {
            const here = team.key === current
            return (
              <LiftCell key={team.key} index={i} className={here ? 'on-ink bg-ink text-bone' : 'bg-bone'}>
                <Link
                  to={team.path}
                  aria-current={here ? 'page' : undefined}
                  className="group flex h-full flex-col p-6 md:p-7"
                >
                  <p className="meta">
                    {pad2(i + 1)} · {countLabel(team)}
                  </p>
                  <h3 className="t-h3 mt-5 underline decoration-2 underline-offset-[6px] group-hover:decoration-[3px]">
                    {team.title}
                  </h3>
                  <p className="t-small mt-4">{team.body}</p>
                  <span className="meta mt-auto pt-6">{here ? 'you are here' : 'meet them →'}</span>
                </Link>
              </LiftCell>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
