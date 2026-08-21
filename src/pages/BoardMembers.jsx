import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import MemberCard from '../components/ui/MemberCard'
import SectionTitle from '../components/ui/SectionTitle'
import { boardMembers } from '../data/members'

const facultyCoord = boardMembers.find(m => m.role === 'Faculty Coordinator')
const boardOnly = boardMembers.filter(m => m.role !== 'Faculty Coordinator')

export default function BoardMembers() {
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
            Club Leadership
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            Meet Our{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Leadership
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Introducing the people responsible for guiding, managing, and growing the Blockchain
            Innovation Club at REC.
          </motion.p>
        </div>
      </div>

      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Faculty Coordinator — featured */}
          {facultyCoord && (
            <div className="mb-14">
              <SectionTitle eyebrow="Faculty" title="[[Faculty Coordinator]]" />
              <div className="max-w-sm mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-3xl p-8 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary/30">
                    {facultyCoord.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="font-heading font-bold text-text-primary text-xl mb-1">{facultyCoord.name}</h3>
                  <p className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">{facultyCoord.role}</p>
                  <p className="text-text-muted text-xs mb-2">{facultyCoord.department}</p>
                  <p className="text-text-muted text-sm leading-relaxed">{facultyCoord.bio}</p>
                </motion.div>
              </div>
            </div>
          )}

          {/* Board Members */}
          <SectionTitle eyebrow="Student Leaders" title="The [[Board]]" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {boardOnly.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
