import { Button, PageHeader } from '../components/kit'
import { Marquee, Reveal, Scramble, SplitText } from '../components/motion'

// Core team selections haven't been announced yet, so this page holds the slot rather than listing
// anyone. Add the roster here (a grid of MemberCell, filtered by Tabs) once the results are out.
const INSTAGRAM = 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=='

const BAND_WORDS = ['Soon', 'Stay tuned', 'Watch this space', 'Any day now']

export default function CoreMembers() {
  return (
    <>
      <PageHeader
        eyebrow="core team intake"
        title="Core members"
        lead="Selections for the core team are still being finalised. Everyone who makes it in will be listed here the moment results are out."
        aside={[['selection', 'pending']]}
      />

      {/* The whole point of this page right now is the wait, so the wait gets the hero treatment:
          three stacked lines at hero scale, the last one hollow. */}
      <section className="on-ink border-b-3 border-ink bg-ink text-bone">
        <div className="wrap section">
          <p className="meta">
            <Scramble text="block #—— · not yet sealed" />
          </p>
          <h2 className="t-hero mt-7">
            <span className="block">
              <SplitText text="Results" trigger="view" />
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
              Applications have closed and the intake is being finalised. Results are announced on Instagram
              first — every core member will be listed here once they&apos;re out.
            </p>
            <div className="mt-9 flex flex-wrap gap-5">
              <Button href={INSTAGRAM} variant="onInk">Follow @bic.rec</Button>
              <Button to="/team/board" variant="ghostOnInk">Meet the board</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee words={BAND_WORDS} />
    </>
  )
}
