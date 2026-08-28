import clsx from 'clsx'

const colors = {
  primary: 'bg-primary/15 text-primary border-primary/30',
  accent: 'bg-accent/15 text-accent border-accent/30',
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
}

export default function Badge({ children, color = 'primary', className }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
      colors[color] || colors.primary,
      className
    )}>
      {children}
    </span>
  )
}
