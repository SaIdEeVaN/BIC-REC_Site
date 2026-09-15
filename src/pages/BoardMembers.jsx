import { PageHeader, SectionHeading } from '../components/kit'
import { AMBER, Slam } from '../components/motion'
import MemberCell from '../components/MemberCell'
import { boardGroups, facultyCoordinators } from '../data/members'
import { pad2 } from '../lib/chain'
import { initials } from '../lib/initials'

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
        title="Meet our leadership"
        lead="The faculty coordinators and student board guiding, managing, and growing the Blockchain Innovation Club at REC."
        aside={[
          ['faculty', pad2(facultyCoordinators.length)],
          ['board', pad2(seats)],
          ['groups', pad2(groups.length)],
        ]}
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <Slam color={AMBER} className="on-ink bg-ink p-6 text-bone shadow-amber md:p-10">
            <p className="meta">faculty coordinators</p>
            {/* Names like MUNEESHWARI need ~320px at the md heading size: initials stack above the name on phones,
                and the two coordinators only sit side by side once each column is wide enough (xl). */}
            <ul className="mt-6 grid gap-8 xl:grid-cols-2">
              {facultyCoordinators.map((coordinator) => (
                <li key={coordinator.name} className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <span
                    aria-hidden="true"
                    className="grid h-20 w-20 shrink-0 place-items-center bg-amber text-[28px] font-black tracking-[-.04em] text-ink"
                  >
                    {initials(coordinator.name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="t-h3">{coordinator.name}</h2>
                    <a
                      href={`mailto:${coordinator.email}`}
                      className="mt-2 inline-block break-all font-mono text-[12.5px] underline decoration-2 underline-offset-4"
                    >
                      {coordinator.email}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Slam>
        </div>
      </section>

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="student leaders" title="The board" />
          <div className="flex flex-col gap-10 md:gap-14">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b-3 border-ink pb-3">
                  <h3 className="t-h3">{group.title}</h3>
                  <p className="meta shrink-0">
                    {pad2(group.members.length)} {group.members.length === 1 ? 'seat' : 'seats'}
                  </p>
                </div>
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
    </>
  )
}
