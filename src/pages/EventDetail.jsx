import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle, Trophy, ExternalLink, Users } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { getEventById, eventTypeColors } from '../data/events'

export default function EventDetail() {
  const { id } = useParams()
  const event = getEventById(id)

  if (!event) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-heading text-4xl text-text-primary mb-4">Event Not Found</h2>
            <p className="text-text-muted mb-6">The event you're looking for doesn't exist.</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
            >
              <ArrowLeft size={16} /> Back to Events
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      {/* Banner */}
      <div className="relative py-40 bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Events
            </Link>
          </motion.div>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <Badge color={eventTypeColors[event.type] || 'primary'}>{event.type}</Badge>
              {event.status === 'upcoming' && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Upcoming
                </span>
              )}
              {event.certificate && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                  🏅 Certificate Provided
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-6 leading-tight"
            >
              {event.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-5 text-text-muted text-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" /> {event.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-accent" /> {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400" /> {event.venue}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading font-bold text-2xl text-text-primary mb-4">About the Event</h2>
                <div className="space-y-4 text-text-muted leading-relaxed">
                  {event.about.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.div>

              {/* Highlights */}
              {event.highlights?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-heading font-bold text-2xl text-text-primary mb-4">Event Highlights</h2>
                  <ul className="space-y-3">
                    {event.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 text-text-muted"
                      >
                        <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Winners */}
              {event.winners?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-heading font-bold text-2xl text-text-primary mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={22} /> Winners
                  </h2>
                  <div className="space-y-3">
                    {event.winners.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-surface border border-border-subtle rounded-2xl"
                      >
                        <span className="text-2xl">{w.position.split(' ')[0]}</span>
                        <div className="flex-1">
                          <div className="font-heading font-semibold text-text-primary">{w.team}</div>
                          <div className="text-text-muted text-sm">{w.project}</div>
                        </div>
                        <div className="font-bold text-emerald-400 text-sm">{w.prize}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Photos placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading font-bold text-2xl text-text-primary mb-4">Event Photos</h2>
                <div className="border-2 border-dashed border-border-subtle rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">📸</div>
                  <p className="text-text-muted">
                    {event.status === 'upcoming' ? 'Photos will be added after the event.' : 'Photos coming soon — check back later!'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Event Details card */}
              <div className="bg-surface border border-border-subtle rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading font-bold text-text-primary mb-4">Event Details</h3>
                <div className="space-y-3 text-sm mb-6">
                  {[
                    { icon: Calendar, label: 'Date', value: event.date, color: 'text-primary' },
                    { icon: Clock, label: 'Time', value: event.time, color: 'text-accent' },
                    { icon: MapPin, label: 'Venue', value: event.venue, color: 'text-emerald-400' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={14} className={`${color} mt-0.5 flex-shrink-0`} />
                      <div>
                        <div className="text-text-muted text-xs">{label}</div>
                        <div className="text-text-primary font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Registration */}
                {event.status === 'upcoming' && (
                  <Button
                    href={event.registrationLink !== '#' ? event.registrationLink : undefined}
                    className="w-full justify-center"
                  >
                    Register Now <ExternalLink size={14} />
                  </Button>
                )}

                {/* Speakers */}
                {event.speakers?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border-subtle">
                    <h4 className="font-heading font-semibold text-text-primary text-sm mb-4 flex items-center gap-2">
                      <Users size={14} /> Speakers
                    </h4>
                    <div className="space-y-4">
                      {event.speakers.map((sp, i) => (
                        <div key={i}>
                          <div className="font-semibold text-text-primary text-sm">{sp.name}</div>
                          <div className="text-primary text-xs">{sp.role}</div>
                          {sp.bio && <div className="text-text-muted text-xs mt-1 leading-relaxed">{sp.bio}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
