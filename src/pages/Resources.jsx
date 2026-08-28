import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, FileText, BookOpen, Code2, Play, Gamepad2, Wrench, Search, Map, Rocket, GraduationCap } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { resources } from '../data/resources'

const tabs = Object.keys(resources)

const typeIcons = {
  PDF: FileText,
  Course: GraduationCap,
  Docs: Code2,
  Video: Play,
  Interactive: Gamepad2,
  Tool: Wrench,
  Research: Search,
  Guide: Map,
  Library: BookOpen,
  Tutorial: GraduationCap,
  Project: Rocket,
}

const typeColors = {
  PDF: 'orange',
  Course: 'primary',
  Docs: 'accent',
  Video: 'red',
  Interactive: 'green',
  Tool: 'blue',
  Research: 'purple',
  Guide: 'yellow',
  Library: 'green',
  Tutorial: 'accent',
  Project: 'orange',
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState(tabs[0])

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
            Learning Resources
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-5xl md:text-6xl text-text-primary mb-6"
          >
            Learn. Build.{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Explore.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-lg max-w-2xl mx-auto"
          >
            Handpicked resources curated by the BIC team to help you master Blockchain and Web3.
          </motion.p>
        </div>
      </div>

      {/* Resources */}
      <section className="py-16 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 border-b border-border-subtle pb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Resource list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {resources[activeTab]?.map((r, i) => {
                const IconComp = typeIcons[r.type] || BookOpen
                return (
                  <motion.a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-5 bg-surface border border-border-subtle rounded-2xl hover:border-primary/30 hover:bg-surface-2 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <IconComp size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                        <Badge color={typeColors[r.type] || 'primary'} className="text-xs">
                          {r.type}
                        </Badge>
                      </div>
                      <p className="text-text-muted text-xs leading-relaxed">{r.description}</p>
                    </div>
                    <ExternalLink size={14} className="text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </motion.a>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Contribute CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-surface border border-border-subtle rounded-3xl text-center"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">
              Know a Great Resource?
            </h3>
            <p className="text-text-muted text-sm mb-5">
              Suggest a resource to be added to our community library.
            </p>
            <Button to="/contact" variant="outline">Suggest a Resource</Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
