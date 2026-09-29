import { Button } from '../components/kit'
import { shortHash } from '../lib/chain'
import { Desync, Marquee, Reveal, Scramble, SplitText, Typewriter, Wipe } from '../components/motion'
import { CLUB_INSTAGRAM, RECRUITMENT_RESULTS_URL } from '../data/club'

// Core team results are out, but each candidate checks their own on the results site (email + roll
// number), so this page sends them there rather than listing anyone. Add the roster here (a grid of
// MemberCell, filtered by Tabs) below the call to action, inside the same section, once it's public.

const BAND_WORDS = ['Check your result', 'Email + roll number', 'Results are live', 'Welcome to the chain']

const TITLE = 'Core members'

// The page is one ink section rather than a bone <PageHeader> stacked on an ink block: the whole page
// is one call to action, and a rule across the middle of it split that in two. The header keeps
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
                  The core team intake is closed and the results are live. Everyone who interviewed can check
                  their own result.
                </p>
              </Wipe>
            </div>
            <dl className="border-3 border-bone">
              <div className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="meta">results</dt>
                <dd className="font-mono text-[12.5px] font-medium uppercase">
                  <Scramble text="live" trigger="mount" delay={0.5} />
                </dd>
              </div>
            </dl>
          </div>

          {/* The whole point of this page right now is sending candidates to their result, so that gets the
              hero treatment: three stacked lines at hero scale, the last one hollow. A future roster goes below it. */}
          <div className="mt-14 md:mt-20">
            {/* The results are published, so the hash is sealed: it decrypts rather than mines. */}
            <p className="meta">
              results sealed · <Scramble text={shortHash('core-members')} />
            </p>
            <h2 className="t-hero mt-7">
              <span className="block">
                <SplitText text="Check" trigger="view" />
              </span>
              <span className="block text-amber">
                <SplitText text="your" trigger="view" delay={0.12} />
              </span>
              <span className="t-outline block">
                <SplitText text="result" trigger="view" delay={0.24} />
              </span>
            </h2>

            <Reveal className="mt-10" delay={420}>
              <p className="t-lead max-w-[46ch]">
                Interviewed for the core team? Sign in on the results page with the email you applied with, and
                use your roll number as the password.
              </p>
              <div className="mt-9 flex flex-wrap gap-5">
                <Button href={RECRUITMENT_RESULTS_URL} variant="onInk">Check your result</Button>
                <Button href={CLUB_INSTAGRAM} variant="ghostOnInk">Follow @bic.rec</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee words={BAND_WORDS} />
    </>
  )
}
