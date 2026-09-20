import { Button } from '../components/kit'
import { shortHash } from '../lib/chain'
import { Desync, Marquee, Mine, Reveal, Scramble, SplitText, Typewriter, Wipe } from '../components/motion'

// Core team selections haven't been announced yet, so this page holds the slot rather than listing
// anyone. Add the roster here (a grid of MemberCell, filtered by Tabs) below the wait, inside the
// same section, once the results are out.
const INSTAGRAM = 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=='

const BAND_WORDS = ['Soon', 'Stay tuned', 'Watch this space', 'Any day now']

const TITLE = 'Core members'

// The page is one ink section rather than a bone <PageHeader> stacked on an ink block: the whole page
// is about the wait, and a rule across the middle of it split that in two. The header keeps
// PageHeader's layout and entrance — eyebrow types, title shunts up and forks on hover, lead unseals,
// the status decrypts — with its rules and curtain in bone, because it now sits on ink.
export default function CoreMembers() {
  return (
    <>
      <section className="on-ink border-b-3 border-ink bg-ink text-bone">
        <div className="wrap section">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="meta mb-5">
                <Typewriter text="core team intake" />
              </p>
              <h1 className="t-title max-w-[13ch]">
                <Desync text={TITLE}>
                  <SplitText text={TITLE} delay={0.15} />
                </Desync>
              </h1>
              <Wipe color="bone" trigger="mount" delay={0.45} className="mt-6 w-fit max-w-[58ch]">
                <p className="t-lead">
                  Selections for the core team are still being finalised. Everyone who makes it in will be
                  listed here the moment results are out.
                </p>
              </Wipe>
            </div>
            <dl className="border-3 border-bone">
              <div className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="meta">selection</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">
                  <Scramble text="pending" trigger="mount" delay={0.5} />
                </dd>
              </div>
            </dl>
          </div>

          {/* The whole point of this page right now is the wait, so the wait gets the hero treatment:
              three stacked lines at hero scale, the last one hollow. A future roster goes below it. */}
          <div className="mt-14 md:mt-20">
            {/* Not sealed because it hasn't been found yet — so show the search, not a settled hash. */}
            <p className="meta">
              block #—— · mining <Mine text={shortHash('core-members')} zeros={4} duration={2.4} />
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
        </div>
      </section>

      <Marquee words={BAND_WORDS} />
    </>
  )
}
