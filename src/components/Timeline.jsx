import { motion } from 'framer-motion'

const milestones = [
  { year: '2024', title: 'Club Founded', desc: 'Blockchain Innovation Club established at REC with 30 founding members and a bold vision.' },
  { year: 'Aug 2024', title: 'First Workshop', desc: 'Blockchain Fundamentals workshop drew 60+ students from 8 departments.' },
  { year: 'Nov 2024', title: 'KBA Partnership', desc: 'Official collaboration established with Kerala Blockchain Association.' },
  { year: 'Jan 2026', title: 'Web3 Hackathon', desc: '12 teams built 5 live DApps. ₹50,000 in prizes distributed.' },
  { year: 'Mar 2026', title: 'Guest Lecture Series', desc: 'Industry experts delivered deep-dive sessions on DeFi, NFTs, and blockchain careers.' },
  { year: '2026', title: 'Growing Strong', desc: '500+ members, 15+ events, 5 live projects, and growing every day.' },
]

export default function Timeline() {
  return (
    <section className="py-20 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Our Journey
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-text-primary">
            Club{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="relative hidden md:block">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary -translate-y-1/2" />

          <div className="flex justify-between items-center relative z-10">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col items-center ${i % 2 === 0 ? 'flex-col-reverse' : ''}`}
                style={{ width: `${100 / milestones.length}%` }}
              >
                <div className={`text-center px-2 ${i % 2 === 0 ? 'mb-6' : 'mt-6'}`}>
                  <div className="text-primary text-xs font-bold mb-1">{m.year}</div>
                  <div className="text-text-primary font-semibold text-sm leading-tight">{m.title}</div>
                  <div className="text-text-muted text-xs mt-1 leading-snug hidden lg:block">{m.desc}</div>
                </div>
                {/* Dot */}
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/50 flex-shrink-0 ring-4 ring-dark" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4"
            >
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0 mt-1.5 ring-2 ring-dark" />
                {i < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/60 to-transparent mt-2 min-h-[40px]" />
                )}
              </div>
              {/* Content */}
              <div className="pb-8">
                <div className="text-primary text-xs font-bold">{m.year}</div>
                <div className="text-text-primary font-semibold text-sm mt-1">{m.title}</div>
                <div className="text-text-muted text-xs mt-1 leading-relaxed">{m.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
