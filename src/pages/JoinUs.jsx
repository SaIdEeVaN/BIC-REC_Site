import { Button, Chip, InkCTA, NodeMesh, PageHeader, SectionHeading, TrackCards } from '../components/kit'
import { LiftCell, Marquee } from '../components/motion'

// Until the club has an application form, both buttons open the contact form with the subject filled in.
// When a form exists, point both buttons at its link with `href` instead of `to`.
const APPLY_PATH = '/contact?subject=Membership%20application'

const whyJoin = [
  { title: 'Learn emerging tech', body: 'Get hands-on with Blockchain, Web3, Solidity, and the latest in decentralized technology.' },
  { title: 'Build real projects', body: 'Work on actual blockchain applications that solve real problems and can be deployed live.' },
  { title: 'Exclusive workshops', body: 'Access member-only workshops, bootcamps, and sessions with industry professionals.' },
  { title: 'Participate in hackathons', body: 'Compete in hackathons, win prizes, and build your portfolio with innovative projects.' },
  { title: 'Network with industry', body: 'Connect with professionals from Kerala Blockchain Association, Web3 companies, and beyond.' },
  { title: 'Develop leadership', body: 'Take on roles in the club team, lead events, and grow as a leader in the tech community.' },
]

const BAND_WORDS = ['Builders', 'Organizers', 'Creatives', 'Communicators', 'Writers']

// The club's domains, by their official names and in the club's own order (CORE_TEAMS in data/coreMembers.js).
const openRoles = [
  { team: 'Event', skills: ['Planning', 'Coordination', 'Management'] },
  { team: 'PR and Outreach', skills: ['Social Media', 'Communication', 'Outreach'] },
  { team: 'Technical', skills: ['Solidity', 'React', 'Web3'] },
  { team: 'Design', skills: ['Figma', 'Canva', 'UI/UX'] },
  { team: 'Research and Innovation', skills: ['Research', 'Writing', 'Whitepapers'] },
  { team: 'Visual Media', skills: ['Photography', 'Videography', 'Editing'] },
  { team: 'Digital Media', skills: ['Content Creation', 'Reels', 'Blogging'] },
]

export default function JoinUs() {
  return (
    <>
      <PageHeader
        eyebrow="membership"
        title="Ready to build the future?"
        lead="Whether you're a developer, designer, researcher, communicator, or simply someone curious about Blockchain — there's a place for you here."
      >
        <Button to={APPLY_PATH}>Join the club</Button>
      </PageHeader>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="benefits" title="Why join BIC?" />
          <TrackCards items={whyJoin} perRow={3} />
        </div>
      </section>

      <Marquee words={BAND_WORDS} />

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="positions open" title="Find your team" />
          <ul className="cells grid sm:grid-cols-2 lg:grid-cols-3">
            {openRoles.map((role, i) => (
              <LiftCell key={role.team} index={i} className="bg-bone p-6">
                <h3 className="t-card">{role.team}</h3>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                  {role.skills.map((skill) => (
                    <li key={skill}>
                      <Chip lower>{skill}</Chip>
                    </li>
                  ))}
                </ul>
              </LiftCell>
            ))}
          </ul>
        </div>
      </section>

      <InkCTA
        title="Ready to join the blockchain revolution?"
        body="Send us a short note about what you'd like to work on and we'll get back to you within 48 hours. No experience needed — just curiosity!"
        aside={
          <div className="border-3 border-bone p-6">
            <p className="meta">the club, drawn</p>
            {/* Shorter than the full-width mesh on the home page: this column is 380px, not the page. */}
            <NodeMesh tone="bone" height="h-[150px]" className="mt-4" />
            <p className="meta mt-4">every member is a peer — you&apos;d be the next one</p>
          </div>
        }
      >
        <Button to={APPLY_PATH} variant="onInk">Apply now</Button>
      </InkCTA>
    </>
  )
}
