import { PageHeader, SectionHeading } from '../components/kit'
import MemberCell from '../components/MemberCell'
import { boardMembers } from '../data/members'
import { pad2 } from '../lib/chain'
import { initials } from '../lib/initials'

const facultyCoord = boardMembers.find((m) => m.role === 'Faculty Coordinator')
const boardOnly = boardMembers.filter((m) => m.role !== 'Faculty Coordinator')

export default function BoardMembers() {
  return (
    <>
      <PageHeader
        eyebrow="club leadership"
        title="Meet our leadership"
        lead="Introducing the people responsible for guiding, managing, and growing the Blockchain Innovation Club at REC."
        aside={[
          ['faculty', pad2(facultyCoord ? 1 : 0)],
          ['board', pad2(boardOnly.length)],
        ]}
      />

      {facultyCoord && (
        <section className="border-b-3 border-ink">
          <div className="wrap section">
            <div className="on-ink grid gap-7 bg-ink p-6 text-bone shadow-amber md:grid-cols-[auto_1fr] md:p-10">
              <span
                aria-hidden="true"
                className="grid h-24 w-24 place-items-center bg-amber text-[34px] font-black tracking-[-.04em] text-ink"
              >
                {initials(facultyCoord.name)}
              </span>
              <div>
                <p className="meta">faculty coordinator · {facultyCoord.department}</p>
                <h2 className="t-h2 mt-3">{facultyCoord.name}</h2>
                <p className="t-lead mt-4 max-w-[60ch]">{facultyCoord.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="student leaders" title="The board" />
          <ul className="cells grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boardOnly.map((member, i) => (
              <MemberCell key={member.id} member={member} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
