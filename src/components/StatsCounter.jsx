import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'

const statItems = [
  { value: 20, suffix: '+', label: 'Workshops', title: 'Conducted' },
  { value: 15, suffix: '+', label: 'Events', title: 'Hosted' },
  { value: 500, suffix: '+', label: 'Members', title: 'Engaged' },
  { value: 5, suffix: '+', label: 'Projects', title: 'Built Live' },
]

export default function StatsCounter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="relative mx-auto max-w-7xl px-6 lg:px-10 py-12 z-20" ref={ref}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-3xl border border-border-subtle/60 bg-surface/40 p-3 backdrop-blur-xl shadow-2xl shadow-black/50">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-border-subtle/40 bg-background/60 p-6 flex flex-col justify-center text-center sm:text-left transition-colors hover:border-primary/40 group"
          >
            <div className="font-display text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-1 group-hover:scale-105 transition-transform origin-left">
              {isInView ? (
                <CountUp start={0} end={stat.value} suffix={stat.suffix} duration={2.5} useEasing />
              ) : (
                `0${stat.suffix}`
              )}
            </div>
            <div className="font-semibold text-text-primary text-sm">{stat.title}</div>
            <div className="eyebrow mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
