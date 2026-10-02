import { PageHeader, SectionHeading } from '../components/kit'
import { AMBER, Reveal, Slam } from '../components/motion'
import MeetUs from '../components/MeetUs'
import MemberCell from '../components/MemberCell'
import { FACULTY, boardGroups, facultyCoordinators } from '../data/members'
import { pad2 } from '../lib/chain'
import { initials } from '../lib/initials'
import { photoFor } from '../lib/memberPhotos'

// Same fallback as MemberCell: the photo when one has been dropped in under the coordinator's slug, their
// initials until then. The name sits right beside it, so the image is decorative and carries no alt text.
function CoordinatorPortrait({ coordinator }) {
  const photo = photoFor(coordinator.slug)
  return photo ? (
    <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
  ) : (
    initials(coordinator.name)
  )
}

// The coordinators' email and LinkedIn read as one line of plain links on the ink panel. Member pages use
// the bordered `fill-up` button instead, but its ink border would vanish against ink here.
const contactLink = 'underline decoration-2 underline-offset-4'

// The page's "about": who the board is.
const ABOUT =
  `The board is the club’s student leadership. The core board (the President, the Vice President and the club’s ambassadors) leads the club and speaks for it, and the executive team runs operations and technology and keeps the club’s records and accounts. With the ${FACULTY}, they set the club’s direction for the year.`

// Block numbers run on from one group to the next, so the whole board reads as a single chain.
let seats = 0
const groups = boardGroups.map((group) => {
  const start = seats
  seats += group.members.length
  return { ...group, start }
})

export default function BoardMembers() {
  return (
    <>
      <PageHeader
        eyebrow="club leadership"
        title="Board members"
        lead={`The ${FACULTY} and student board guiding, managing, and growing the Blockchain Innovation Club at REC.`}
        aside={[
          ['faculty', pad2(facultyCoordinators.length)],
          ['board', pad2(seats)],
          ['groups', pad2(groups.length)],
        ]}
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="about the board" title="Who sets the club’s course" lead={ABOUT} />
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <Slam color={AMBER} className="on-ink bg-ink p-6 text-bone shadow-amber md:p-10">
            <p className="meta">{FACULTY}</p>
            {/* Names like MUNEESHWARI need ~320px at the md heading size: the portrait stacks above the name on phones,
                and two coordinators would only sit side by side once each column is wide enough (xl). */}
            <ul className="mt-6 grid gap-8 xl:grid-cols-2">
              {facultyCoordinators.map((coordinator) => (
                <li key={coordinator.name} className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <span
                    aria-hidden="true"
                    className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden bg-amber text-[28px] font-black tracking-[-.04em] text-coal"
                  >
                    <CoordinatorPortrait coordinator={coordinator} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="t-h3">{coordinator.name}</h2>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12.5px]">
                      <a href={`mailto:${coordinator.email}`} className={`break-all ${contactLink}`}>
                        {coordinator.email}
                      </a>
                      {coordinator.linkedin && (
                        <a href={coordinator.linkedin} target="_blank" rel="noopener noreferrer" className={`whitespace-nowrap ${contactLink}`}>
                          LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Slam>
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="student leaders" title="The board" />
          <div className="flex flex-col gap-10 md:gap-14">
            {groups.map((group) => (
              <div key={group.title}>
                <Reveal className="mb-5 flex items-baseline justify-between gap-4 border-b-3 border-ink pb-3">
                  <h3 className="t-h3">{group.title}</h3>
                  <p className="meta shrink-0">
                    {pad2(group.members.length)} {group.members.length === 1 ? 'seat' : 'seats'}
                  </p>
                </Reveal>
                <ul className="cells grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.members.map((member, i) => (
                    <MemberCell key={member.name} member={member} index={group.start + i} heading="h4" />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MeetUs current="board" />
    </>
  )
}
