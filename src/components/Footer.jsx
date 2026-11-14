import { Link } from 'react-router-dom'
import { head, short } from '../lib/ledger'
import { CLUB_INSTAGRAM, CLUB_LINKEDIN, CLUB_MAILTO } from '../data/club'
import { BlockClock } from './kit'
import { Desync, Roll, Scramble, SplitText } from './motion'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
]

const moreLinks = [
  { name: 'The Chain', path: '/chain' },
  { name: 'Mine a Block', path: '/mine' },
  { name: 'Terminal', path: '/terminal' },
  { name: 'Projects', path: '/projects' },
  { name: 'Board Members', path: '/team/board' },
  { name: 'Core Members', path: '/team/core' },
  { name: 'Associate Members', path: '/team/associates' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Resources', path: '/resources' },
]

const socialLinks = [
  { label: 'Instagram', href: CLUB_INSTAGRAM },
  { label: 'LinkedIn', href: CLUB_LINKEDIN },
  { label: 'Email', href: CLUB_MAILTO },
]

const linkClass = 'u-link roll-host text-[15px] font-extrabold uppercase'

function FooterNav({ title, links, children }) {
  return (
    <nav aria-label={title}>
      <h2 className="meta">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.path}>
            <Link to={l.path} className={linkClass}>
              <Roll>{l.name}</Roll>
            </Link>
          </li>
        ))}
        {children && <li>{children}</li>}
      </ul>
    </nav>
  )
}

export default function Footer() {
  return (
    <footer className="on-ink border-t-3 border-bone bg-ink text-bone">
      <div className="wrap section grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="md:col-span-2 lg:col-span-1">
          {/* The wordmark forks on hover — the one hover accent over the entrance the characters run. */}
          <Link to="/" className="t-cta inline-block">
            <Desync text="BIC/REC">
              <SplitText text="BIC/REC" by="char" trigger="view" stagger={0.05} />
            </Desync>
          </Link>
          <p className="t-body mt-5 max-w-[38ch]">
            Blockchain Innovation Club, Rajalakshmi Engineering College. Innovate. Decentralize. Build the future.
          </p>
          <p className="meta mt-4">in partnership with kerala blockchain academy</p>
          <ul className="mt-7 flex flex-wrap gap-3">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="fill-up block border-3 border-bone px-3 py-2 text-[13.5px] font-extrabold uppercase"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterNav title="quick links" links={quickLinks} />
        <FooterNav title="explore" links={moreLinks} />
      </div>

      <div className="border-t-3 border-bone">
        <div className="wrap flex flex-col gap-2 py-5 font-mono text-[12px] sm:flex-row sm:justify-between">
          <span>© 2026 blockchain innovation club · rajalakshmi engineering college. all rights reserved.</span>
          {/* The chain keeps sealing blocks while the page is open, so the footer counts them rather
              than printing the date the page happened to be built. */}
          <span className="flex flex-wrap items-center gap-x-2">
            <span>
              head <Scramble text={short(head.hash)} duration={1} /> ·
            </span>
            <BlockClock />
          </span>
        </div>
      </div>
    </footer>
  )
}
