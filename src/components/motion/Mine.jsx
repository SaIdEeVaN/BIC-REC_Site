import { useEffect, useState } from 'react'
import { animate } from 'motion/react'
import { useReveal } from './core'

const GLYPHS = '0123456789abcdef'
const HEX = /[0-9a-f]/i

// One hash the miner tried: the leading zeros it has already found, then hex noise for everything else.
// `tick` advances in steps so the noise re-rolls at a readable rate instead of once a frame, and the
// roll is derived from the position and the real character, so the churn is stable rather than random.
function candidate(text, progress, zeros) {
  const prefix = text.startsWith('0x') ? '0x' : ''
  const found = Math.floor(progress * (zeros + 1))
  const tick = Math.floor(progress * 26)
  let at = 0

  const body = Array.from(text.slice(prefix.length))
    .map((ch) => {
      if (!HEX.test(ch)) return ch
      const i = at++
      return i < found ? '0' : GLYPHS[(i * 7 + tick * 11 + ch.charCodeAt(0)) % GLYPHS.length]
    })
    .join('')

  return prefix + body
}

// Proof of work: the hash churns through candidates while the difficulty zeros lock in from the left,
// one at a time. When the last one lands the block is found and the real hash snaps into place.
//
// <Scramble> decrypts at a constant rate — every character locks in turn, left to right, and you can
// read the answer arriving. This one searches: nothing is settled until the difficulty is met. It is for
// the one hash on a page that should read as *being mined*, not for the dozen that are merely arriving.
export default function Mine({ text, zeros = 3, duration = 1.7, delay = 0, trigger = 'view', className = '' }) {
  const [ref, active, canAnimate] = useReveal({ trigger })
  const [progress, setProgress] = useState(canAnimate ? 0 : 1)

  useEffect(() => {
    if (!canAnimate || !active) return
    const controls = animate(0, 1, { duration, delay, ease: 'linear', onUpdate: (v) => setProgress(v) })
    return () => controls.stop()
  }, [canAnimate, active, duration, delay])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{progress >= 1 ? text : candidate(text, progress, zeros)}</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
