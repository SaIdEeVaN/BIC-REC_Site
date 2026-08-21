import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProjectCard from '../components/ui/ProjectCard'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import { projects, projectCategories } from '../data/projects'

const categories = ['All', ...projectCategories]

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All' ? projects : projects.filter(p => p.category === filter)

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
            Student Innovation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            From Ideas to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Innovation
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Real projects built by BIC members, tackling real-world problems with blockchain technology.
          </motion.p>
        </div>
      </div>

      {/* Filter + Grid */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
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

          {/* Projects grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.length > 0 ? (
                filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-5xl mb-4">🔬</div>
                  <p className="text-text-muted">No projects in this category yet. Watch this space!</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-3xl p-10"
          >
            <div className="text-5xl mb-4">💡</div>
            <h3 className="font-heading font-bold text-2xl text-text-primary mb-3">Have a Project Idea?</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              Work with us! Pitch your blockchain project idea to the BIC Technical Team. We provide
              mentorship, resources, and a community to help you build and launch it.
            </p>
            <Button to="/contact">Get in Touch</Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
