import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import MemberCard from '../components/ui/MemberCard'
import SectionTitle from '../components/ui/SectionTitle'
import { coreMembers, teams } from '../data/members'

const allTeams = ['All', ...teams]

const teamDescriptions = {
  All: 'All active core members working across 6 specialized teams to keep BIC running.',
  'Technical Team': 'The builders — smart contract developers, Web3 engineers, and blockchain researchers.',
  'Events Team': 'The organizers — making every event a seamless and memorable experience.',
  'Design & Media Team': 'The creatives — visual designers, photographers, and content creators.',
  'PR & Outreach Team': 'The communicators — social media, external relations, and community growth.',
  'Content Team': 'The writers — technical articles, blog posts, newsletters, and documentation.',
  'Operations Team': 'The backbone — logistics, resource management, and operational excellence.',
}

export default function CoreMembers() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? coreMembers : coreMembers.filter(m => m.team === filter)

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
            The Core Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            The Team{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Behind the Club
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            15+ active student volunteers working across 6 specialized teams to make BIC run.
          </motion.p>
        </div>
      </div>

      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Team filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allTeams.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === t
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'bg-surface border border-border-subtle text-text-muted hover:border-primary/40 hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Team description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={filter}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-text-muted mb-12 max-w-xl mx-auto text-sm"
            >
              {teamDescriptions[filter]}
            </motion.p>
          </AnimatePresence>

          {/* Members grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
            >
              {filtered.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}
