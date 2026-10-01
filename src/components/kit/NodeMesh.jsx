import { motion } from 'motion/react'
import { HOPS, LINKS, NODES } from '../../lib/mesh'
import { EASE, useReveal } from '../motion/core'

// Peers, and the news travelling between them. Squares are nodes, 3px rules are the links. On reveal the
// links draw and the node outlines follow; from then on a broadcast leaves the origin and reaches the
// whole mesh hop by hop, forever — a packet runs down every link of a hop at once, and each node it
// reaches fills amber until the round settles and the next one starts.
//
// The topology lives in lib/mesh.js, authored once in a fixed 600x300 viewBox and scaled to fit. Strokes
// are `non-scaling-stroke`, so the rules stay a true 3px on a phone instead of thinning to a hair when
// the viewBox is squeezed to 330px — the system has no rule below 2px.

const HOP = 0.55 // seconds a packet spends crossing one link
const SETTLE = 0.8 // how long the whole mesh holds the block before the round resets
const ENTRANCE = 1.4 // links and outlines are drawn by here, so the first broadcast waits this long

const REACH = HOPS * HOP // the last node lights here
const DARK = REACH + SETTLE // and the whole mesh goes dark here
const CYCLE = DARK + 0.7 // one full round: broadcast, settle, reset

const PACKET = 0.28 // share of a link the travelling dash covers
const NODE = 20

// `ink` is the mesh on a bone section, `bone` the mesh on an ink one. Amber is the block, either way.
// Classes rather than colours, so the mesh follows the dark theme: rules are currentColor, a resting node
// is filled with the section's own background.
const TONES = {
  ink: { rule: 'text-ink', rest: 'fill-bone' },
  bone: { rule: 'text-bone', rest: 'fill-ink' },
}

// `height` is Tailwind height classes for the drawing itself: the mesh scales to fit whatever box it is
// given, so a narrow aside column wants a shorter one than a full-width section.
export default function NodeMesh({ tone = 'ink', height = 'h-[190px] md:h-[340px]', className = '' }) {
  const [ref, active, canAnimate] = useReveal()
  const on = !canAnimate || active
  const { rule, rest } = TONES[tone] ?? TONES.ink

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" className={`block w-full ${height} ${rule}`}>
        {LINKS.map(([from, to], i) => {
          const a = NODES[from]
          const b = NODES[to]
          const line = { x1: a.x, y1: a.y, x2: b.x, y2: b.y, strokeWidth: 3, vectorEffect: 'non-scaling-stroke' }

          return (
            <g key={i}>
              <motion.line
                {...line}
                stroke="currentColor"
                initial={canAnimate ? { pathLength: 0 } : false}
                animate={{ pathLength: on ? 1 : 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.1 + a.hop * 0.18 }}
              />
              {canAnimate && on && (
                <motion.line
                  {...line}
                  className="stroke-amber"
                  initial={{ pathLength: PACKET, pathOffset: -PACKET }}
                  animate={{ pathLength: PACKET, pathOffset: [-PACKET, 1] }}
                  transition={{
                    duration: HOP,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: CYCLE - HOP,
                    delay: ENTRANCE + a.hop * HOP,
                  }}
                />
              )}
            </g>
          )
        })}

        {NODES.map((node, i) => {
          const lit = node.hop * HOP
          const held = DARK - lit
          const box = { x: node.x - NODE / 2, y: node.y - NODE / 2, width: NODE, height: NODE }

          return (
            <g key={i}>
              {/* The fill is its own rects so the outline can be drawn on entrance while the fill
                  keeps its own forever-repeating round — one animation each, no fighting. The amber block
                  is laid over the resting fill and switched on and off, since an SVG attribute can't
                  animate between theme colours. */}
              <rect {...box} className={rest} />
              {canAnimate && (
                <motion.rect
                  {...box}
                  className="fill-amber"
                  initial={{ opacity: 0 }}
                  animate={on ? { opacity: [1, 1, 0] } : undefined}
                  transition={{
                    duration: held,
                    // Held amber for all but the last flicker of its turn, so it switches hard rather than fading out.
                    times: [0, 0.97, 1],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: CYCLE - held,
                    delay: ENTRANCE + lit,
                  }}
                />
              )}
              <motion.rect
                {...box}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                initial={canAnimate ? { pathLength: 0 } : false}
                animate={{ pathLength: on ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.2 + node.hop * 0.18 }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

