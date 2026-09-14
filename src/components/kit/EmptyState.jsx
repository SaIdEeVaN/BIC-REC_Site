// Full ink panel, amber shadow, one amber CTA.
export default function EmptyState({ title, body, action }) {
  return (
    <div className="on-ink bg-ink p-7 text-bone shadow-amber md:p-12">
      <h2 className="t-empty max-w-[16ch]">{title}</h2>
      {body && <p className="t-body mt-4 max-w-[52ch]">{body}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
