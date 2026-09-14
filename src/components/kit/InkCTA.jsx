// Inverted call-to-action section.
export default function InkCTA({ title, body, aside, children }) {
  return (
    <section className="on-ink bg-ink text-bone">
      <div className="wrap section grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
        <div>
          <h2 className="t-cta max-w-[14ch]">{title}</h2>
          {body && <p className="t-lead mt-5 max-w-[52ch]">{body}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-5">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  )
}
