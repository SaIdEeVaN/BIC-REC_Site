import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col h-full rounded-2xl border border-border-subtle/60 bg-surface/40 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface-2/40"
    >
      {/* Category Eyebrow */}
      <div className="flex items-center justify-between mb-4">
        <span className="eyebrow !mb-0">{project.category}</span>
        {project.awards && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
            🏆 {project.awards}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-2xl text-text-primary mb-2 group-hover:text-primary transition-colors">
        {project.name}
      </h3>
      
      <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-[10px] font-mono text-text-muted bg-surface border border-border-subtle rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-subtle/50 mt-auto">
        {project.github && project.github !== '#' && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-text-primary hover:text-primary transition-colors bg-surface px-3 py-2 rounded-lg border border-border-subtle"
          >
            <FiGithub size={14} /> Repository
          </a>
        )}
        {project.demo && project.demo !== '#' && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-text-primary hover:text-accent transition-colors bg-surface px-3 py-2 rounded-lg border border-border-subtle"
          >
            <FiExternalLink size={14} /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  )
}
