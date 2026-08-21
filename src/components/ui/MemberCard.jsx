import { motion } from 'framer-motion'
import { FiLinkedin, FiGithub } from 'react-icons/fi'

export default function MemberCard({ member, index = 0 }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border-subtle/60 bg-surface/40 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-4">
        {/* Avatar */}
        <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 text-primary font-display font-bold text-lg group-hover:scale-105 transition-transform">
          {getInitials(member.name)}
        </div>
        
        {/* Social Links */}
        <div className="flex gap-1">
          {member.linkedin && member.linkedin !== '#' && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-text-muted hover:text-[#0077b5] transition-colors rounded-md hover:bg-surface-2"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={16} />
            </a>
          )}
          {member.github && member.github !== '#' && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-text-muted hover:text-white transition-colors rounded-md hover:bg-surface-2"
              aria-label="GitHub"
            >
              <FiGithub size={16} />
            </a>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-display font-bold text-lg text-text-primary leading-tight">
          {member.name}
        </h4>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-primary">
          {member.role}
        </p>
        <div className="mt-3 h-[1px] w-full bg-border-subtle/50"></div>
        <p className="mt-3 text-xs text-text-muted">
          {member.department}
          {member.team && member.team !== 'Board' && (
            <span className="block mt-1 font-medium opacity-70">{member.team}</span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
