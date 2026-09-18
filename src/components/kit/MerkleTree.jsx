import { motion } from 'motion/react'
import { AMBER, BONE, EASE, INK, useReveal } from '../motion/core'

// A merkle tree, folded. Leaves are drawn along the bottom, then each level's pairs route up and inward
// on right-angled rules until the whole set hashes down to one amber root — the club's year sealed into
// a single block.
//
// Bottom-up, one level at a time, so it reads as folding rather than as a diagram that appeared. Strokes
// are `non-scaling-stroke` so the rules hold 3px when the viewBox is scaled down on a phone.

const W = 600
const H = 260
const PAD = 26
const LEAF = 15
const ROOT = 21

const DRAW = 0.4 // a level's connectors
const LEVEL = 0.42 // gap between one level folding and the next

const TONES = {
  ink: { rule: INK, rest: BONE },
  bone: { rule: BONE, rest: INK },
}

// Levels bottom-up: level 0 is the leaves, the last level is the single root.
function levelsOf(leaves) {
  const depth = Math.round(Math.log2(leaves))
  return Array.from({ length: depth + 1 }, (_, level) => {
    const count = leaves >> level
    const y = H - PAD - (level * (H - 2 * PAD)) / depth
    return Array.from({ length: count }, (_, i) => ({ x: (W * (i + 0.5)) / count, y }))
  })
}

// Right angles, not diagonals: the child rises, turns in toward its parent's column, and rises into it.
const routeTo = (child, parent) => {
  const mid = (child.y + parent.y) / 2
  return `M ${child.x} ${child.y} L ${child.x} ${mid} L ${parent.x} ${mid} L ${parent.x} ${parent.y}`
}

export default function MerkleTree({ leaves = 8, tone = 'ink', delay = 0, className = '' }) {
  const [ref, active, canAnimate] = useReveal()
  const on = !canAnimate || active
  const { rule, rest } = TONES[tone] ?? TONES.ink
  const levels = levelsOf(leaves)
  const top = levels.length - 1

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-[180px] w-full md:h-[320px]"
      >
        {levels.slice(0, top).map((level, l) =>
          level.map((child, i) => (
            <motion.path
              key={`${l}-${i}`}
              d={routeTo(child, levels[l + 1][i >> 1])}
              fill="none"
              stroke={rule}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              initial={canAnimate ? { pathLength: 0 } : false}
              animate={{ pathLength: on ? 1 : 0 }}
              transition={{ duration: DRAW, ease: EASE, delay: delay + 0.35 + l * LEVEL }}
            />
          ))
        )}

        {levels.map((level, l) =>
          level.map((node, i) => {
            const root = l === top
            const size = root ? ROOT : LEAF
            // The root's amber lands the instant its outline closes, rather than sitting filled on the
            // page while the tree below it is still folding.
            // Leaves land in sequence; every level above lands as its connectors finish reaching it.
            const at = l === 0 ? delay + i * 0.05 : delay + 0.35 + (l - 1) * LEVEL + DRAW

            return (
              <motion.rect
                key={`${l}-${i}`}
                x={node.x - size / 2}
                y={node.y - size / 2}
                width={size}
                height={size}
                stroke={rule}
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                initial={canAnimate ? { pathLength: 0, fill: rest } : false}
                animate={{ pathLength: on ? 1 : 0, fill: on && root ? AMBER : rest }}
                transition={{
                  pathLength: { duration: 0.35, ease: EASE, delay: at },
                  fill: { duration: 0, delay: at + 0.3 },
                }}
              />
            )
          })
        )}
      </svg>
    </div>
  )
}
