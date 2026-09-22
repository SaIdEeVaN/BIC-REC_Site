import { ChainRail, Chip, Ledger, LedgerRow, PageHeader, SectionHeading, StatBar, TrackCards } from '../components/kit'
import { Scramble } from '../components/motion'
import { stats, achievements } from '../data/achievements'
import { shortHash } from '../lib/chain'

// Exact counts carry no `+` — only students reached, which is the one figure that is a floor rather
// than a tally. Projects and hackathons are gone rather than shown as zero: the club hasn't run one yet,
// and /projects says so in its own words.
// Four of these currently read 1, so the label has to agree with the number: "1 workshops" undercuts a
// page whose whole job is stating what the club has actually done.
const cell = (value, one, many = `${one}s`) => ({ value: `${value}`, label: value === 1 ? one : many })

const statItems = [
  cell(stats.members, 'member'),
  cell(stats.events, 'event'),
  cell(stats.workshops, 'workshop'),
  cell(stats.immersionPrograms, 'immersion program'),
  { label: 'students reached', value: `${stats.studentsReached}+` },
  cell(stats.collaborations, 'collaboration'),
]

const recognition = [
  { title: 'Kerala Blockchain Association', body: 'Official student chapter partner.' },
]

export default function Achievements() {
  return (
    <>
      <PageHeader
        eyebrow="milestones"
        title="Our achievements"
        lead="A journey of learning, building, and winning — here's what we've accomplished together."
      />

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <StatBar items={statItems} highlight={2} />
        </div>
      </section>

      <section className="border-b-3 border-ink">
        <div className="wrap section">
          <SectionHeading eyebrow="highlights" title="Key milestones" />
          {/* The milestones are a chain: one node each, the most recent one the head. */}
          <ChainRail nodes={achievements.length} className="-mt-4 mb-4" />
          <Ledger head={['date', 'milestone', 'category', 'block']}>
            {achievements.map((a, i) => (
              <LedgerRow
                key={a.id}
                index={i}
                date={a.date}
                main={
                  <>
                    <h3 className="t-row">{a.title}</h3>
                    <p className="t-small mt-2">{a.description}</p>
                  </>
                }
                side={<Chip>{a.category}</Chip>}
                status={
                  <>
                    <span className="block">Sealed</span>
                    <span className="meta mt-2 block">
                      <Scramble text={shortHash(a.title)} delay={i * 0.07 + 0.3} />
                    </span>
                  </>
                }
              />
            ))}
          </Ledger>
        </div>
      </section>

      <section>
        <div className="wrap section">
          <SectionHeading eyebrow="recognized by" title="Our partners & recognition" />
          <TrackCards items={recognition} perRow={2} />
        </div>
      </section>
    </>
  )
}
