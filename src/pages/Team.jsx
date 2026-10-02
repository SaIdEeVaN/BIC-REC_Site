import { PageHeader } from '../components/kit'
import MeetUs from '../components/MeetUs'
import { MEMBER_TEAMS } from '../data/teams'
import { pad2 } from '../lib/chain'

// "Meet us": the way into the club's three teams, each with a page of its own.
export default function Team() {
  return (
    <>
      <PageHeader
        eyebrow="the people"
        title="Meet us"
        lead="BIC/REC is run by its members, in three teams: the board leads the club, the core team runs its domains, and the associates are its newest members."
        aside={MEMBER_TEAMS.map((team) => [team.key, team.count > 0 ? pad2(team.count) : 'soon'])}
      />
      <MeetUs eyebrow="three teams, one chain" title="Pick a team" />
    </>
  )
}
