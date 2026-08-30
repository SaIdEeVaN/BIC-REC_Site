import { Link } from 'react-router-dom'
import { FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi'

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
]

const socialLinks = [
  { icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/bic.rec?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==', color: 'hover:text-pink-400' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/bicrec', color: 'hover:text-blue-400' },
  { icon: FiMail, label: 'Email', href: 'mailto:kbaclub@rajalakshmil.edu.in', color: 'hover:text-accent' },
]

export default function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border-subtle overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-heading font-bold text-white text-base shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                BIC
              </div>
              <div>
                <div className="font-heading font-bold text-text-primary text-lg leading-tight">
                  Blockchain Innovation Club
                </div>
                <div className="text-text-muted text-sm">Rajalakshmi Engineering College</div>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-xs">
              Innovate. Decentralize. Build the Future.
            </p>
            <p className="text-text-muted text-xs mb-6">
              In partnership with{' '}
              <span className="text-primary font-semibold">Kerala Blockchain Association</span>
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-surface-2 border border-border-subtle flex items-center justify-center text-text-muted transition-all hover:border-primary/40 hover:bg-primary/10 hover:scale-110 ${s.color}`}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-text-muted text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-border-subtle group-hover:bg-primary transition-colors" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {moreLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-text-muted text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-border-subtle group-hover:bg-primary transition-colors" />
                    {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/resources"
                  className="text-text-muted text-sm hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-border-subtle group-hover:bg-primary transition-colors" />
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  className="text-accent text-sm hover:text-primary transition-colors flex items-center gap-1.5 group font-semibold"
                >
                  <span className="w-1 h-1 rounded-full bg-accent group-hover:bg-primary transition-colors" />
                  Join the Club →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-xs">
          <span>© 2026 Blockchain Innovation Club | Rajalakshmi Engineering College. All Rights Reserved.</span>
          <span className="flex items-center gap-1">
            Made with <span className="text-red-400">❤️</span> by the BIC Team
          </span>
        </div>
      </div>
    </footer>
  )
}
