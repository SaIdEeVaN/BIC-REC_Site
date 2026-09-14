const INK = '#14110E'
const BONE = '#EDE6D8'
const AMBER = '#D9A441'

// The chain, drawn: one 3px rail, a 16px square per block with two diagonal branches.
// The last square is the head and is filled amber.
export default function ChainRail({ nodes = 6, className = '' }) {
  return (
    <svg aria-hidden="true" className={`block h-16 w-full overflow-visible ${className}`}>
      <line x1="0" y1="32" x2="100%" y2="32" stroke={INK} strokeWidth="3" />
      {Array.from({ length: nodes }, (_, i) => (
        <svg key={i} x={`${((i + 0.5) / nodes) * 100}%`} y="0" overflow="visible">
          <line x1="-8" y1="24" x2="-21" y2="11" stroke={INK} strokeWidth="3" strokeLinecap="square" />
          <line x1="-8" y1="40" x2="-21" y2="53" stroke={INK} strokeWidth="3" strokeLinecap="square" />
          <rect
            x="-8"
            y="24"
            width="16"
            height="16"
            fill={i === nodes - 1 ? AMBER : BONE}
            stroke={INK}
            strokeWidth="3"
          />
        </svg>
      ))}
    </svg>
  )
}
