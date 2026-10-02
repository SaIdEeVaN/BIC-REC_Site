import { Button, InkCTA, PageHeader, SectionHeading, TrackCards } from '../components/kit'
import { Marquee } from '../components/motion'
import MeetUs from '../components/MeetUs'

const BAND_WORDS = ['Blockchain', 'Web3', 'Smart contracts', 'DeFi']

const story = [
  {
    title: 'The journey',
    body: 'Founded in August 2025, we bridge the gap between student curiosity and industry expertise through hands-on workshops, hackathons and live builds.',
  },
  {
    title: 'Our impact',
    body: 'Taking members from first principles to shipping on-chain — workshops, guest sessions and a team to build alongside.',
  },
  {
    title: 'Our ethos',
    body: 'We believe in collaborative innovation, fostering a mindset where every member contributes to our collective tech success.',
  },
]

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="blockchain innovation club · rec"
        title="About us"
        lead="A student-driven community dedicated to exploring Blockchain, Web3, and emerging technologies at Rajalakshmi Engineering College."
      />

      <Marquee words={BAND_WORDS} />

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="the chapter so far" title="Journey, impact, ethos" />
          <TrackCards items={story} />
        </div>
      </section>

      <MeetUs
        className="border-t-3 border-ink"
        lead="The club is run by its members, in three teams: the board leads the club, the core team runs its seven domains, and the associates are its newest members."
      />

      <section className="border-t-3 border-ink">
        <div className="wrap section">
          <SectionHeading
            eyebrow="the record"
            title="Everything folds into one root"
            lead="Workshops, hackathons, guest lectures, builds — each one is sealed on its own, and each seal folds into the next until a whole year of the club hashes down to a single block."
          />
        </div>
      </section>

      <InkCTA
        title="Build with us"
        body="Workshops, hackathons and real projects — open to every department and every year."
      >
        <Button to="/join" variant="onInk">Join the club</Button>
        <Button to="/events" variant="ghostOnInk">See our events</Button>
      </InkCTA>
    </>
  )
}
