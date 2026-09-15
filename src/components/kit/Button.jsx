import { Link } from 'react-router-dom'
import { Roll } from '../motion'

// Ghost buttons fill from the bottom edge on hover (.fill-up); every label rolls (see Roll).
const VARIANTS = {
  amber: 'btn-amber',
  bone: 'btn-bone',
  onInk: 'btn-on-ink',
  ghostOnInk: 'btn-ghost-ink fill-up',
}

export default function Button({ to, href, variant = 'amber', className = '', children, ...rest }) {
  const cls = `btn ${VARIANTS[variant]} ${className}`
  const label = <Roll>{children}</Roll>

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {label}
      </Link>
    )
  }

  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {label}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...rest}>
      {label}
    </button>
  )
}
