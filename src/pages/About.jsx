import { Button, InkCTA, MerkleTree, PageHeader, SectionHeading, TrackCards } from '../components/kit'
import { Marquee, Mine, Slam } from '../components/motion'
import { pad2, shortHash } from '../lib/chain'

const BAND_WORDS = ['Blockchain', 'Web3', 'Smart contracts', 'DeFi']

// Leaves in the tree below. A power of two, so every level pairs off cleanly down to one root.
const LEAVES = 8
const DEPTH = Math.log2(LEAVES)

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

      <section className="border-t-3 border-ink">
        <div className="wrap section">
          <SectionHeading
            eyebrow="the record"
            title="Everything folds into one root"
            lead="Workshops, hackathons, guest lectures, builds — each one is sealed on its own, and each seal folds into the next until a whole year of the club hashes down to a single block."
          />
          {/* The panel lands, then the tree folds inside it: one block motion, one accent. */}
          <Slam className="border-3 border-ink bg-bone p-5 shadow-ink md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
              <p className="meta">merkle root</p>
              <p className="font-mono text-[12.5px] font-medium">
                <Mine text={shortHash('bic-rec')} delay={0.3} />
              </p>
            </div>
            <MerkleTree leaves={LEAVES} delay={0.25} className="mt-6" />
            <p className="meta mt-6">
              {pad2(LEAVES)} leaves · depth {pad2(DEPTH)} · one root
            </p>
          </Slam>
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
