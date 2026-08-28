import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import PageTransition from '../components/PageTransition'
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import { stats, achievements } from '../data/achievements'

const statItems = [
  { label: 'Workshops', value: stats.workshops, suffix: '+', icon: '🎓' },
  { label: 'Events Hosted', value: stats.events, suffix: '+', icon: '📅' },
  { label: 'Students', value: stats.students, suffix: '+', icon: '👥' },
  { label: 'Projects Built', value: stats.projects, suffix: '+', icon: '💡' },
  { label: 'Hackathons', value: stats.hackathons, suffix: '', icon: '🚀' },
  { label: 'Collaborations', value: stats.collaborations, suffix: '', icon: '🤝' },
]

const categoryColors = {
  Competition: 'orange',
  Collaboration: 'accent',
  Milestone: 'primary',
  Recognition: 'yellow',
  Technical: 'green',
  Media: 'purple',
}

export default function Achievements() {
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
            Milestones
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Achievements
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            A journey of learning, building, and winning — here's what we've accomplished together.
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statItems.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-5 bg-surface border border-border-subtle rounded-2xl hover:border-primary/30 transition-colors"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <CountUp end={s.value} suffix={s.suffix} duration={2} enableScrollSpy scrollSpyOnce />
                </div>
                <div className="text-text-muted text-xs mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Highlights" title="[[Key]] Milestones" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-dark border border-border-subtle rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge color={categoryColors[a.category] || 'primary'}>{a.category}</Badge>
                  <span className="text-text-muted text-xs">{a.date}</span>
                </div>
                <h3 className="font-heading font-bold text-text-primary text-base mb-2 leading-snug">
                  {a.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{a.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle eyebrow="Recognized By" title="Our [[Partners]] & Recognition" />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🏛️', name: 'Kerala Blockchain Association', desc: 'Official student chapter partner' },
              { icon: '🏫', name: 'Rajalakshmi Engineering College', desc: 'Best Innovation Club — Annual Day 2025' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border-subtle rounded-2xl p-8 hover:border-primary/30 transition-all"
              >
                <div className="text-5xl mb-3">{r.icon}</div>
                <h4 className="font-heading font-bold text-text-primary text-lg mb-1">{r.name}</h4>
                <p className="text-text-muted text-sm">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
