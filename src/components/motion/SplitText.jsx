import { Fragment } from 'react'
import { motion } from 'motion/react'
import { EASE, useReveal } from './core'

// Kinetic type: each word (or character) shunts up out of its own clipped slot.
export default function SplitText({ text, by = 'word', trigger = 'mount', delay = 0, stagger = 0.08 }) {
  const [ref, active, canAnimate] = useReveal({ trigger })

  if (!canAnimate) return text

  const parts = by === 'char' ? Array.from(text) : text.split(' ')

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, i) => (
          <Fragment key={i}>
            <span className="-my-[0.1em] inline-block overflow-hidden py-[0.1em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '115%' }}
                animate={{ y: active ? '0%' : '115%' }}
                transition={{ duration: 0.65, ease: EASE, delay: delay + i * stagger }}
              >
                {part}
              </motion.span>
            </span>
            {by === 'word' && i < parts.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
