import { useEffect, useState } from 'react'
import { animate } from 'motion/react'
import { useReveal } from './core'

const GLYPHS = '0123456789abcdef'
const KEEP = new Set([' ', '·', '#', '.', '…', '/', '-', ':', '&'])

// Decrypt effect for mono metadata: characters cycle through hex glyphs and lock in left to right.
// `replay`: bump the number to decrypt again straight away (e.g. when the card holding it is hovered).
export default function Scramble({ text, duration = 0.8, delay = 0, trigger = 'view', replay = 0, className = '' }) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  const [progress, setProgress] = useState(canAnimate ? 0 : 1)

  useEffect(() => {
    if (!canAnimate || !active) return
    const controls = animate(0, 1, {
      duration,
      delay: replay ? 0 : delay,
      ease: 'linear',
      onUpdate: (v) => setProgress(v),
    })
    return () => controls.stop()
  }, [canAnimate, active, duration, delay, replay])

  const chars = Array.from(text)
  const locked = Math.floor(progress * chars.length)
  const tick = Math.floor(progress * 30)
  const shown =
    progress >= 1
      ? text
      : chars
          .map((ch, i) =>
            i < locked || KEEP.has(ch) ? ch : GLYPHS[(i * 7 + tick * 11 + ch.charCodeAt(0)) % GLYPHS.length]
          )
          .join('')

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
