import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar'
import { RouteShutter } from './components/motion'
import Footer from './components/Footer'
import Home from './pages/Home'
import { metaFor } from './seo'

// Home ships in the main bundle; every other page is its own chunk, fetched on first visit.
const About = lazy(() => import('./pages/About'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const BoardMembers = lazy(() => import('./pages/BoardMembers'))
const MemberDetail = lazy(() => import('./pages/MemberDetail'))
const CoreMembers = lazy(() => import('./pages/CoreMembers'))
const Projects = lazy(() => import('./pages/Projects'))
const Achievements = lazy(() => import('./pages/Achievements'))
const News = lazy(() => import('./pages/News'))
const Resources = lazy(() => import('./pages/Resources'))
const JoinUs = lazy(() => import('./pages/JoinUs'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// [selector, key in metaFor() result] — the tags themselves live in index.html's seo block.
const HEAD_TAGS = [
  ['meta[name="description"]', 'description'],
  ['meta[property="og:title"]', 'title'],
  ['meta[property="og:description"]', 'description'],
  ['meta[property="og:url"]', 'url'],
  ['meta[name="twitter:title"]', 'title'],
  ['meta[name="twitter:description"]', 'description'],
]

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)

    const meta = metaFor(pathname)
    document.title = meta.title
    for (const [selector, key] of HEAD_TAGS) {
      document.head.querySelector(selector)?.setAttribute('content', meta[key])
    }
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.url)
  }, [pathname])

  return null
}

function PageFallback() {
  return (
    <div className="wrap section" role="status">
      <p className="meta">loading block…</p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <MotionConfig reducedMotion="user">
      <RouteEffects />
      <RouteShutter />
      <div className="flex min-h-screen flex-col bg-bone text-ink">
        <a href="#main" className="btn btn-amber skip-link">Skip to content</a>
        <Navbar />
        <main id="main" className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/team/board" element={<BoardMembers />} />
              <Route path="/team/board/:slug" element={<MemberDetail />} />
              <Route path="/team/core" element={<CoreMembers />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/news" element={<News />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/join" element={<JoinUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      </MotionConfig>
    </Router>
  )
}
