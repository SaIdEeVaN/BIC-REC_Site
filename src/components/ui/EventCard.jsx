import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import Badge from './Badge'
import { eventTypeColors } from '../../data/events'

export default function EventCard({ event, index = 0 }) {
  const isUpcoming = event.status === 'upcoming'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="group block relative rounded-2xl border border-border-subtle/60 bg-surface/40 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-colors duration-500" />

      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="eyebrow !mb-0">{event.type}</span>
            {isUpcoming && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Next Event
              </span>
            )}
          </div>
          
          <h3 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <p className="text-text-muted text-sm line-clamp-2 max-w-2xl mb-4 md:mb-0">
            {event.about}
          </p>
        </div>

        {/* Right: Meta & CTA */}
        <div className="flex flex-col md:items-end shrink-0 gap-4 md:w-48 border-t border-border-subtle/60 md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Calendar size={14} className="text-primary/70" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Clock size={14} className="text-accent/70" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <MapPin size={14} className="text-emerald-400/70" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
          
          <Link
            to={`/events/${event.id}`}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isUpcoming 
                ? 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20' 
                : 'bg-surface-2 text-text-primary hover:bg-surface-3 border border-border-subtle'
            }`}
          >
            {isUpcoming ? 'Register' : 'View Recap'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
