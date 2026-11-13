import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import logo from '../assets/logo/BIC logo.jpeg'
import { Ticker } from './kit'
import { EASE, Roll, SNAP, Scramble, ScrollProgress } from './motion'
import { setTheme, useTheme } from '../lib/theme'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/team', label: 'Meet us' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact us' },
]

// Desktop nav: one shared ink block slides to whichever item is active.
function ActiveFill() {
  return <motion.span layoutId="nav-active" aria-hidden="true" className="absolute inset-0 bg-ink" transition={SNAP} />
}

// A square, half inked: the ink shunts across to the other half when the theme flips.
function ThemeGlyph({ dark }) {
  return (
    <span aria-hidden="true" className="relative block h-[22px] w-[22px] shrink-0 overflow-hidden border-3 border-ink">
      <span
        className={`absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          dark ? '' : 'translate-x-full'
        }`}
      />
    </span>
  )
}

// One button for the theme: a header cell where the bar has room for it (sm and up), and a row at the
// foot of the menu on narrower phones, where Join and Menu already take what the bar has left.
function ThemeToggle({ className, children }) {
  const dark = useTheme() === 'dark'

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label="Dark theme"
      title={dark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      className={className}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {children}
      <ThemeGlyph dark={dark} />
    </button>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  // The menu remembers the page it was opened on, so navigating anywhere closes it without an effect.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  // The wordmark decrypts on load and again whenever the mouse comes back to it.
  const [replay, setReplay] = useState(0)

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
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 px-4 md:pl-[44px]"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setReplay((n) => n + 1)}
          >
            <img src={logo} alt="" className="logo-lift h-10 w-10 shrink-0 border-3 border-ink object-cover md:h-12 md:w-12" />
            <span className="flex flex-col leading-none">
              <span className="text-[22px] font-black uppercase tracking-[-.04em] md:text-[26px]">
                <Scramble text="BIC/REC" trigger="mount" duration={0.6} replay={replay} />
              </span>
              <span className="meta mt-1 hidden whitespace-nowrap sm:block">blockchain innovation club</span>
            </span>
            {/* The link is named by the words on it, plus where it goes. It used to carry an aria-label instead
                ("BIC/REC home"), which replaced those words: someone using voice control says what they can see
                ("click blockchain innovation club"), and a name that leaves it out doesn't answer. */}
            <span className="sr-only">home</span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `roll-host relative flex items-center whitespace-nowrap border-l-3 border-ink px-3.5 text-[14px] font-extrabold uppercase xl:px-5 ${
                    isActive ? 'text-bone' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <ActiveFill />}
                    <span className="relative">
                      <Roll>{link.label}</Roll>
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Whichever cell comes first after the logo takes the slack, so the rest sit at the right edge: the menu
              links from lg, the theme toggle from sm, the Menu button below that. */}
          <ThemeToggle className="hidden w-[64px] items-center justify-center border-l-3 border-ink sm:ml-auto sm:flex md:w-[76px] lg:ml-0" />

          <button
            type="button"
            className="ml-auto flex w-[84px] items-center justify-center border-l-3 border-ink text-[14px] font-extrabold uppercase sm:ml-0 lg:hidden"
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
              <div key={link.to} className="overflow-hidden border-t-3 border-ink first:border-t-0">
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
          {open && (
            <div className="overflow-hidden border-t-3 border-ink sm:hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.45, ease: EASE, delay: links.length * 0.05 }}
              >
                <ThemeToggle className="flex w-full items-center justify-between bg-bone px-4 py-4 text-[24px] font-black uppercase tracking-[-.03em]">
                  Dark theme
                </ThemeToggle>
              </motion.div>
            </div>
          )}
        </nav>

        <ScrollProgress />
      </header>
    </>
  )
}
