import { useState } from 'react'
import { PageHeader, Tabs } from '../components/kit'
import MemberCell from '../components/MemberCell'
import { coreMembers, teams } from '../data/members'
import { pad2 } from '../lib/chain'

const allTeams = ['All', ...teams]

const teamDescriptions = {
  All: 'All active core members working across 6 specialized teams to keep BIC running.',
  'Technical Team': 'The builders — smart contract developers, Web3 engineers, and blockchain researchers.',
  'Events Team': 'The organizers — making every event a seamless and memorable experience.',
  'Design & Media Team': 'The creatives — visual designers, photographers, and content creators.',
  'PR & Outreach Team': 'The communicators — social media, external relations, and community growth.',
  'Content Team': 'The writers — technical articles, blog posts, newsletters, and documentation.',
  'Operations Team': 'The backbone — logistics, resource management, and operational excellence.',
}

export default function CoreMembers() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? coreMembers : coreMembers.filter((m) => m.team === filter)

  return (
    <>
      <PageHeader
        eyebrow="the core team"
        title="The team behind the club"
        lead="15+ active student volunteers working across 6 specialized teams to make BIC run."
        aside={[
          ['members', pad2(coreMembers.length)],
          ['teams', pad2(teams.length)],
        ]}
      />

      <section>
        <div className="wrap section">
          <Tabs label="Filter members by team" options={allTeams} value={filter} onChange={setFilter} />
          <p className="t-body mt-6 max-w-[60ch]">{teamDescriptions[filter]}</p>
          <ul className="cells mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((member, i) => (
              <MemberCell key={member.id} member={member} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
