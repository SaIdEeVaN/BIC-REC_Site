const TAGS = { span: 'span', h2: 'h2', p: 'p' }

// Fork: for a moment the label disagrees with itself. Two hard-offset copies — one amber, one mint —
// snap out of register on a steps() cadence and snap back into consensus.
//
// Hard offsets only. The copies are switched with `visibility`, never faded, and nothing blurs. All of
// the movement is CSS (`.desync` in index.css), so it costs nothing until a pointer arrives and the
// reduced-motion rule leaves the label sitting still.
//
// `text` draws the two ghosts; `children` draws the real layer, so this can sit over an entrance that
// renders its own markup: <Desync text="BIC/REC"><SplitText text="BIC/REC" by="char" /></Desync>.
export default function Desync({ text, as = 'span', className = '', children }) {
  const Tag = TAGS[as] ?? 'span'

  return (
    <Tag className={`desync ${className}`}>
      <span aria-hidden="true" className="desync-ghost desync-a">{text}</span>
      <span aria-hidden="true" className="desync-ghost desync-b">{text}</span>
      <span className="relative">{children ?? text}</span>
    </Tag>
  )
}
