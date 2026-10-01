// States from DESIGN_SYSTEM.md: pending = amber, confirmed = bone, archived = outline, shipped = mint.
// Text on amber and mint is coal, which stays dark in the dark theme where ink turns light.
const TONES = {
  outline: '',
  pending: 'bg-amber text-coal',
  confirmed: 'bg-bone text-ink',
  shipped: 'bg-mint text-coal',
}

export default function Chip({ tone = 'outline', lower = false, className = '', children }) {
  return <span className={`chip ${TONES[tone]} ${lower ? 'chip-lower' : ''} ${className}`}>{children}</span>
}
