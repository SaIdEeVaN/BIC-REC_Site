import { Button, Chip, InkCTA, PageHeader, SectionHeading, TrackCards } from '../components/kit'
import { LiftCell, Marquee, Stamp } from '../components/motion'

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

const openRoles = [
  { team: 'Technical Team', skills: ['Solidity', 'React', 'Web3'] },
  { team: 'Events Team', skills: ['Planning', 'Coordination', 'Management'] },
  { team: 'Design & Media Team', skills: ['Figma', 'Canva', 'Photography'] },
  { team: 'PR & Outreach Team', skills: ['Social Media', 'Communication', 'Outreach'] },
  { team: 'Content Team', skills: ['Writing', 'Research', 'Blogging'] },
  { team: 'Operations Team', skills: ['Logistics', 'Planning', 'Organisation'] },
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
            {openRoles.map((role) => (
              <LiftCell key={role.team} className="bg-bone p-6">
                <h3 className="t-card">{role.team}</h3>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                  {role.skills.map((skill, i) => (
                    <li key={skill}>
                      <Stamp delay={0.1 + i * 0.08}>
                        <Chip lower>{skill}</Chip>
                      </Stamp>
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
      >
        <Button to={APPLY_PATH} variant="onInk">Apply now</Button>
      </InkCTA>
    </>
  )
}
