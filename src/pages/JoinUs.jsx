import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const whyJoin = [
  { icon: '💡', title: 'Learn Emerging Tech', desc: 'Get hands-on with Blockchain, Web3, Solidity, and the latest in decentralized technology.' },
  { icon: '🛠️', title: 'Build Real Projects', desc: 'Work on actual blockchain applications that solve real problems and can be deployed live.' },
  { icon: '🎓', title: 'Exclusive Workshops', desc: 'Access member-only workshops, bootcamps, and sessions with industry professionals.' },
  { icon: '⚡', title: 'Participate in Hackathons', desc: 'Compete in hackathons, win prizes, and build your portfolio with innovative projects.' },
  { icon: '🤝', title: 'Network with Industry', desc: 'Connect with professionals from Kerala Blockchain Association, Web3 companies, and beyond.' },
  { icon: '👑', title: 'Develop Leadership', desc: 'Take on roles in the club team, lead events, and grow as a leader in the tech community.' },
]

const openRoles = [
  { team: 'Technical Team', icon: '⚙️', skills: ['Solidity', 'React', 'Web3'] },
  { team: 'Events Team', icon: '📅', skills: ['Planning', 'Coordination', 'Management'] },
  { team: 'Design & Media Team', icon: '🎨', skills: ['Figma', 'Canva', 'Photography'] },
  { team: 'PR & Outreach Team', icon: '📣', skills: ['Social Media', 'Communication', 'Outreach'] },
  { team: 'Content Team', icon: '✍️', skills: ['Writing', 'Research', 'Blogging'] },
  { team: 'Operations Team', icon: '🏗️', skills: ['Logistics', 'Planning', 'Organisation'] },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function JoinUs() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative text-center px-4 max-w-3xl mx-auto">
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-6xl block mb-6"
          >
            🚀
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-5xl md:text-7xl text-text-primary mb-4 leading-tight"
          >
            Ready to Build the{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Future?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Whether you're a developer, designer, researcher, communicator, or simply someone curious
            about Blockchain — there's a place for you here.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button href="#" size="lg">JOIN THE CLUB</Button>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Benefits
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-text-primary">
              Why{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Join BIC?
              </span>
            </h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyJoin.map((w) => (
              <motion.div
                key={w.title}
                variants={item}
                whileHover={{ y: -5 }}
                className="gradient-border p-6 bg-surface-2 rounded-2xl"
              >
                <div className="text-4xl mb-4">{w.icon}</div>
                <h3 className="font-heading font-bold text-text-primary text-lg mb-2">{w.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Positions Open
            </span>
            <h2 className="font-heading font-bold text-4xl text-text-primary">
              Find Your{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Team
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {openRoles.map((r, i) => (
              <motion.div
                key={r.team}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface border border-border-subtle rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="text-3xl mb-3">{r.icon}</div>
                <h4 className="font-heading font-bold text-text-primary mb-3">{r.team}</h4>
                <div className="flex flex-wrap gap-2">
                  {r.skills.map(s => (
                    <Badge key={s} color="primary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-surface">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-3xl p-12"
          >
            <div className="text-5xl mb-4">⛓️</div>
            <h3 className="font-heading font-bold text-3xl text-text-primary mb-3">
              Ready to Join the Blockchain Revolution?
            </h3>
            <p className="text-text-muted mb-8 leading-relaxed">
              Fill out our application form and we'll get back to you within 48 hours. No experience
              needed — just curiosity!
            </p>
            <Button href="#" size="lg">
              Apply Now →
            </Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
