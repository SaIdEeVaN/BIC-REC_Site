import { Link } from 'react-router-dom'

const VARIANTS = {
  amber: 'btn-amber',
  bone: 'btn-bone',
  onInk: 'btn-on-ink',
  ghostOnInk: 'btn-ghost-ink',
}

export default function Button({ to, href, variant = 'amber', className = '', children, ...rest }) {
  const cls = `btn ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
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
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
