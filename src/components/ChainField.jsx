import { useEffect, useRef } from 'react'
import { startChainField } from '../lib/chainField'
import { useCanAnimate } from './motion/core'

// The animated chain behind every page (see lib/chainField.js). Fixed behind the whole page by default;
// `contained` fills its own section instead, for ink sections that would otherwise cover the page-wide field.
// A contained field's section needs `relative isolate`, so the field sits under the section's content.
export default function ChainField({ tone = 'bone', contained = false }) {
  const ref = useRef(null)
  const canAnimate = useCanAnimate()

  useEffect(() => startChainField(ref.current, { tone, animate: canAnimate }), [tone, canAnimate])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none ${contained ? 'absolute' : 'fixed'} inset-0 -z-10 block h-full w-full`}
    />
  )
}
