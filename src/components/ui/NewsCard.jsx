import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from './Badge'

const categoryColors = {
  Announcement: 'accent',
  Achievement: 'green',
  Event: 'primary',
  Workshop: 'orange',
}

export default function NewsCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex gap-4 p-5 bg-surface border border-border-subtle rounded-2xl hover:border-primary/30 hover:bg-surface-2 transition-all group"
    >
      {/* Date block */}
      <div className="flex-shrink-0 text-center w-16">
        <div className="bg-primary/10 rounded-xl p-2 border border-primary/20">
          <Calendar size={16} className="text-primary mx-auto mb-1" />
          <div className="text-primary text-xs font-bold leading-none">
            {item.date.split(' ')[0]}
          </div>
          <div className="text-text-muted text-xs">
            {item.date.split(' ')[1]?.replace(',', '')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1.5">
          <Badge color={categoryColors[item.category] || 'primary'}>{item.category}</Badge>
        </div>
        <h3 className="font-heading font-semibold text-text-primary text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{item.description}</p>
        {item.link && item.link !== '#' && (
          <Link
            to={item.link}
            className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-2 hover:gap-2 transition-all"
          >
            Read more <ArrowRight size={10} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
