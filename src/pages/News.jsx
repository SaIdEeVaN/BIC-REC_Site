import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import NewsCard from '../components/ui/NewsCard'
import Button from '../components/ui/Button'
import { news, newsCategories } from '../data/news'

const categories = ['All', ...newsCategories]

export default function News() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? news : news.filter(n => n.category === filter)

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
            Latest Updates
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            What's{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happening?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Stay updated with the latest news, announcements, and achievements from the Blockchain
            Innovation Club.
          </motion.p>
        </div>
      </div>

      {/* Filter + News */}
      <section className="py-16 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
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

          {/* News feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} />
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📰</div>
                  <p className="text-text-muted">No news in this category yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stay updated CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-surface border border-border-subtle rounded-3xl text-center"
          >
            <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">Stay in the Loop</h3>
            <p className="text-text-muted mb-6 text-sm">Follow us on social media to never miss an update.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button href="#" variant="outline">📸 Instagram</Button>
              <Button href="#" variant="outline">💼 LinkedIn</Button>
              <Button href="#" variant="outline">🐙 GitHub</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
