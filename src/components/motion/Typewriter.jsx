import { useEffect, useState } from 'react'
import { animate } from 'motion/react'
import { useReveal } from './core'

// Types text out behind a hard block caret. The full text is laid out invisibly first, so nothing reflows.
export default function Typewriter({ text, speed = 0.028, delay = 0, trigger = 'mount' }) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  const [count, setCount] = useState(canAnimate ? 0 : text.length)

  useEffect(() => {
    if (!canAnimate || !active) return
    const controls = animate(0, text.length, {
      duration: text.length * speed,
      delay,
      ease: 'linear',
      onUpdate: (v) => setCount(Math.floor(v)),
    })
    return () => controls.stop()
  }, [canAnimate, active, text, speed, delay])

  return (
    <span ref={ref} className="relative inline-block max-w-full">
      <span className="invisible" aria-hidden="true">{text}</span>
      <span className="absolute inset-0" aria-hidden="true">
        {text.slice(0, count)}
        {canAnimate && count < text.length && <span className="caret" />}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
