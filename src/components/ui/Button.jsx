import { Link } from 'react-router-dom'
import clsx from 'clsx'

const variants = {
  primary: 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/30',
  outline: 'border border-primary/50 text-text-primary hover:bg-primary/10 hover:border-primary',
  ghost: 'text-text-muted hover:text-primary hover:bg-primary/5',
  white: 'bg-white text-dark hover:bg-gray-100',
  danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-base rounded-full',
}

export default function Button({ children, variant = 'primary', size = 'md', className, onClick, to, href, type = 'button' }) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer',
    variants[variant],
    sizes[size],
    className
  )

  if (to) {
    return <Link to={to} className={classes}>{children}</Link>
  }
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
