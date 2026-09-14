import { Link } from 'react-router-dom'
import { sealedDate, shortHash } from '../lib/chain'
import { SplitText } from './motion'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
]

const moreLinks = [
  { name: 'Projects', path: '/projects' },
  { name: 'Board Members', path: '/team/board' },
  { name: 'Core Members', path: '/team/core' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'News', path: '/news' },
  { name: 'Resources', path: '/resources' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bicrec' },
  { label: 'Email', href: 'mailto:kbaclub@rajalakshmil.edu.in' },
]

const linkClass = 'text-[15px] font-extrabold uppercase decoration-[3px] underline-offset-[5px] hover:underline'

function FooterNav({ title, links, children }) {
  return (
    <nav aria-label={title}>
      <h2 className="meta">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.path}>
            <Link to={l.path} className={linkClass}>{l.name}</Link>
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
          <Link to="/" className="t-cta inline-block">
            <SplitText text="BIC/REC" by="char" trigger="view" stagger={0.05} />
          </Link>
          <p className="t-body mt-5 max-w-[38ch]">
            Blockchain Innovation Club, Rajalakshmi Engineering College. Innovate. Decentralize. Build the future.
          </p>
          <p className="meta mt-4">in partnership with kerala blockchain association</p>
          <ul className="mt-7 flex flex-wrap gap-3">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block border-3 border-bone px-3 py-2 text-[13.5px] font-extrabold uppercase hover:bg-bone hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterNav title="quick links" links={quickLinks} />
        <FooterNav title="explore" links={moreLinks}>
          <Link to="/join" className={`${linkClass} text-amber`}>Join the club</Link>
        </FooterNav>
      </div>

      <div className="border-t-3 border-bone">
        <div className="wrap flex flex-col gap-2 py-5 font-mono text-[12px] sm:flex-row sm:justify-between">
          <span>© 2026 blockchain innovation club · rajalakshmi engineering college. all rights reserved.</span>
          <span>head {shortHash('bic-rec')} · sealed {sealedDate(new Date())}</span>
        </div>
      </div>
    </footer>
  )
}
