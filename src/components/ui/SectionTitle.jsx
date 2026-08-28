import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function renderTitle(t) {
  if (!t) return null
  const parts = t.split(/\[\[(.+?)\]\]/)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="text-primary">{part}</span>
      : part
  )
}

export default function SectionTitle({ eyebrow, title, subtitle, rightLink, centered = false, className = '' }) {
  return (
    <div className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 ${centered ? 'text-center md:flex-col md:items-center' : ''} ${className}`}>
      <div className={centered ? 'w-full flex flex-col items-center' : 'max-w-2xl'}>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow font-sans font-semibold text-primary uppercase tracking-[0.2em] text-sm mb-3 flex items-center gap-2 justify-start"
          >
            {!centered && <div className="h-[1px] w-6 bg-primary/50"></div>}
            {eyebrow}
          </motion.div>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-bold uppercase text-5xl md:text-6xl text-text-primary leading-[0.9] tracking-wide mb-4"
          >
            {renderTitle(title)}
          </motion.h2>
        )}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-muted text-sm md:text-base leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {rightLink && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={centered ? 'mt-4' : 'flex-shrink-0 pb-2'}
        >
          <Link
            to={rightLink.to}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors group"
          >
            {rightLink.text}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
