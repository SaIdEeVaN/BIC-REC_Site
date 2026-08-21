import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import PageTransition from '../components/PageTransition'
import Badge from '../components/ui/Badge'

const allPhotos = [
  { id: 1, category: 'Workshops', title: 'Blockchain Fundamentals Workshop', date: 'Jan 2026', gradient: 'from-violet-600 to-indigo-600' },
  { id: 2, category: 'Workshops', title: 'Smart Contract Session', date: 'Apr 2026', gradient: 'from-blue-600 to-cyan-600' },
  { id: 3, category: 'Hackathons', title: 'Web3 Hackathon 2026', date: 'Feb 2026', gradient: 'from-purple-600 to-pink-600' },
  { id: 4, category: 'Hackathons', title: 'Hackathon Final Presentations', date: 'Feb 2026', gradient: 'from-rose-600 to-orange-600' },
  { id: 5, category: 'Guest Sessions', title: 'DeFi Expert Session', date: 'Mar 2026', gradient: 'from-emerald-600 to-teal-600' },
  { id: 6, category: 'Guest Sessions', title: 'KBA Expert Talk', date: 'Nov 2024', gradient: 'from-teal-600 to-cyan-600' },
  { id: 7, category: 'Team Moments', title: 'Core Team Meeting', date: 'Dec 2025', gradient: 'from-orange-600 to-amber-600' },
  { id: 8, category: 'Team Moments', title: 'Club Founding Day', date: '2024', gradient: 'from-yellow-600 to-orange-600' },
  { id: 9, category: 'Events', title: 'Certificate Distribution', date: 'Jan 2026', gradient: 'from-green-600 to-emerald-600' },
  { id: 10, category: 'Events', title: 'Community Meetup Prep', date: 'May 2026', gradient: 'from-cyan-600 to-blue-600' },
  { id: 11, category: 'Club Activities', title: 'Design Team at Work', date: 'Mar 2026', gradient: 'from-pink-600 to-rose-600' },
  { id: 12, category: 'Club Activities', title: 'Technical Team Workshop', date: 'Feb 2026', gradient: 'from-indigo-600 to-violet-600' },
]

const galleryCats = ['All', 'Workshops', 'Hackathons', 'Guest Sessions', 'Events', 'Team Moments', 'Club Activities']

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const filtered = filter === 'All' ? allPhotos : allPhotos.filter(p => p.category === filter)

  const slides = filtered.map(p => ({
    src: `https://picsum.photos/seed/${p.id + 20}/800/600`,
  }))

  return (
    <PageTransition>
      {/* Page Hero */}
      <div className="relative py-36 bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Visual Memories
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gallery
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Memories That Matter — A visual collection of the club's activities and achievements.
          </motion.p>
        </div>
      </div>

      {/* Filter + Grid */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {galleryCats.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'bg-surface border border-border-subtle text-text-muted hover:border-primary/40 hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${photo.gradient} group`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-heading font-semibold text-sm leading-tight">{photo.title}</p>
                    <p className="text-xs opacity-80 mt-1">{photo.date}</p>
                    <div className="mt-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">{photo.category}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📸</div>
              <p className="text-text-muted">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </PageTransition>
  )
}
