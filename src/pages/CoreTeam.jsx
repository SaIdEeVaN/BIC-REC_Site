import { Button, PageHeader, SectionHeading } from '../components/kit'
import { Reveal } from '../components/motion'
import MeetUs from '../components/MeetUs'
import MemberCell from '../components/MemberCell'
import { DOMAINS } from '../data/domains'
import { coreGroups, coreTeamMembers } from '../data/members'
import { pad2 } from '../lib/chain'

// The page's "about": who the core team is.
const ABOUT = `The core team runs the club’s seven domains: ${DOMAINS.slice(0, -1).join(', ')} and ${DOMAINS.at(-1)}. Each domain’s leads and co-leads plan its work, see it through, and bring their domain’s associates along.`

// Block numbers run on from one group to the next, so the whole core team reads as a single chain.
let seats = 0
const groups = coreGroups.map((group) => {
  const start = seats
  seats += group.members.length
  return { ...group, start }
})

// The core team: the leads and co-leads of each domain, grouped by domain in the club's order. This address used
// to be the recruitment page, which now lives at /team/associates, so the header points there for anyone who
// arrives from an old link.
export default function CoreTeam() {
  return (
    <>
      <PageHeader
        eyebrow="the core team"
        title="Core members"
        lead="The leads and co-leads who run the Blockchain Innovation Club’s domains, day to day."
        aside={[
          ['members', pad2(coreTeamMembers.length)],
          ['domains', pad2(DOMAINS.length)],
          ['groups', pad2(groups.length)],
        ]}
      >
        <Button to="/team/associates">2026–27 recruitment</Button>
      </PageHeader>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="about the core team" title="The people who run the domains" lead={ABOUT} />
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="domain leads" title="The core team" />
          <div className="flex flex-col gap-10 md:gap-14">
            {groups.map((group) => (
              <div key={group.title}>
                <Reveal className="mb-5 flex items-baseline justify-between gap-4 border-b-3 border-ink pb-3">
                  <h3 className="t-h3">{group.title}</h3>
                  <p className="meta shrink-0">
                    {pad2(group.members.length)} {group.members.length === 1 ? 'lead' : 'leads'}
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

      <MeetUs current="core" />
    </>
  )
}
