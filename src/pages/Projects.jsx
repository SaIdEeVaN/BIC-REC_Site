import { Button, PageHeader } from '../components/kit'
import { shortHash } from '../lib/chain'
import { Marquee, Mine, Reveal, SplitText } from '../components/motion'
import { CLUB_INSTAGRAM } from '../data/club'
import ChainField from '../components/ChainField'

// No student projects are ready to publish yet, so this page holds the slot rather than listing any.
// The previous listing — builds list, filters and the StackChart tech breakdown — is in git at e8c152d:
// `git show e8c152d:src/pages/Projects.jsx` and `git show e8c152d:src/components/StackChart.jsx`.

const BAND_WORDS = ['Building', 'In progress', 'Watch this space', 'Soon']

export default function Projects() {
  return (
    <>
      <PageHeader
        eyebrow="student innovation"
        title="Projects"
        lead="Members are building the club's first blockchain projects. Each one will be published here — problem, stack, team and source — as it ships."
        aside={[['builds', 'pending']]}
      />

      <section className="on-ink relative isolate border-b-3 border-ink bg-ink text-bone">
        <ChainField tone="ink" contained />
        <div className="wrap section">
          {/* Not sealed because it hasn't been found yet — so show the search, not a settled hash. */}
          <p className="meta">
            block #—— · mining <Mine text={shortHash('projects')} zeros={4} duration={2.4} />
          </p>
          <h2 className="t-hero mt-7">
            <span className="block">
              <SplitText text="Builds" trigger="view" />
            </span>
            <span className="block text-amber">
              <SplitText text="coming" trigger="view" delay={0.12} />
            </span>
            <span className="t-outline block">
              <SplitText text="soon" trigger="view" delay={0.24} />
            </span>
          </h2>

          <Reveal className="mt-10" delay={420}>
            <p className="t-lead max-w-[46ch]">
              The technical team is working on the club&apos;s first builds. Have an idea worth shipping? Pitch
              it — we provide mentorship, resources and a team to build it with.
            </p>
            <div className="mt-9 flex flex-wrap gap-5">
              <Button to="/contact?subject=Project%20pitch" variant="onInk">Pitch a project</Button>
              <Button href={CLUB_INSTAGRAM} variant="ghostOnInk">Follow @bic.rec</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee words={BAND_WORDS} />
    </>
  )
}
