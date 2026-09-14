import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import logo from '../assets/logo/BIC logo.jpeg'
import { Ticker } from './kit'
import { EASE, SNAP, ScrollProgress } from './motion'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact us' },
]

// Desktop nav: one shared ink block slides to whichever item (or Join) is active.
function ActiveFill() {
  return <motion.span layoutId="nav-active" aria-hidden="true" className="absolute inset-0 bg-ink" transition={SNAP} />
}

export default function Navbar() {
  const { pathname } = useLocation()
  // The menu remembers the page it was opened on, so navigating anywhere closes it without an effect.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpenOn(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <Ticker />
      <header className="sticky top-0 z-40 border-b-3 border-ink bg-bone">
        <div className="mx-auto flex h-16 max-w-[1280px] items-stretch md:h-[76px]">
          <Link to="/" className="flex min-w-0 items-center gap-3 px-4 md:pl-[44px]" aria-label="BIC/REC home">
            <img src={logo} alt="" className="h-10 w-10 shrink-0 border-3 border-ink object-cover md:h-12 md:w-12" />
            <span className="flex flex-col leading-none">
              <span className="text-[22px] font-black uppercase tracking-[-.04em] md:text-[26px]">BIC/REC</span>
              <span className="meta mt-1 hidden sm:block">blockchain innovation club</span>
            </span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `relative flex items-center border-l-3 border-ink px-5 text-[14px] font-extrabold uppercase ${
                    isActive ? 'text-bone' : 'decoration-[3px] underline-offset-[6px] hover:underline'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <ActiveFill />}
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/join"
            className={({ isActive }) =>
              `relative ml-auto flex items-center border-l-3 border-ink bg-amber px-4 text-[14px] font-extrabold uppercase md:px-6 lg:ml-0 ${
                isActive ? 'text-bone' : 'text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <ActiveFill />}
                <span className="relative">Join</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            className="flex w-[84px] items-center justify-center border-l-3 border-ink text-[14px] font-extrabold uppercase lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Main"
          hidden={!open}
          className="absolute inset-x-0 top-full border-b-3 border-ink bg-bone lg:hidden"
        >
          {open &&
            links.map((link, i) => (
              <div key={link.to} className="overflow-hidden border-b-3 border-ink last:border-b-0">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `block px-4 py-4 text-[24px] font-black uppercase tracking-[-.03em] ${
                        isActive ? 'bg-ink text-bone' : 'bg-bone'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              </div>
            ))}
        </nav>

        <ScrollProgress />
      </header>
    </>
  )
}
