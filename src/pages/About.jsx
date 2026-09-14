import { Button, InkCTA, PageHeader, SectionHeading, TrackCards } from '../components/kit'

const story = [
  {
    title: 'The journey',
    body: "Founded in 2010, we've bridged the gap between student curiosity and industry expertise through immersive tech experiences.",
  },
  {
    title: 'Our impact',
    body: 'Transforming 750+ students into industry-ready professionals through award-winning projects and career-launching initiatives.',
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

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="the chapter so far" title="Journey, impact, ethos" />
          <TrackCards items={story} />
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
