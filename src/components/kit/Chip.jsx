// States from DESIGN_SYSTEM.md: pending = amber, confirmed = bone, archived = outline, shipped = mint.
const TONES = {
  outline: '',
  pending: 'bg-amber text-ink',
  confirmed: 'bg-bone text-ink',
  shipped: 'bg-mint text-ink',
}

export default function Chip({ tone = 'outline', lower = false, className = '', children }) {
  return <span className={`chip ${TONES[tone]} ${lower ? 'chip-lower' : ''} ${className}`}>{children}</span>
}
