import { useId } from 'react'
import { motion } from 'motion/react'
import { SNAP } from '../motion/core'

// Filter tabs: joined cells; the ink selection fill slides to the chosen tab.
export default function Tabs({ options, value, onChange, label, className = '' }) {
  const id = useId()

  return (
    <div role="group" aria-label={label} className={`cells flex flex-wrap ${className}`}>
      {options.map((option) => {
        const selected = option === value
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`relative bg-bone px-4 py-2.5 text-[13.5px] font-extrabold uppercase ${
              selected ? 'text-bone' : 'decoration-[3px] underline-offset-4 hover:underline'
            }`}
          >
            {selected && (
              <motion.span layoutId={`tab-${id}`} aria-hidden="true" className="absolute inset-0 bg-ink" transition={SNAP} />
            )}
            <span className="relative">{option}</span>
          </button>
        )
      })}
    </div>
  )
}
