export default function SectionHeading({ eyebrow, title, lead, action }) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="meta mb-4">{eyebrow}</p>}
        <h2 className="t-h2 max-w-[17ch]">{title}</h2>
        {lead && <p className="t-lead mt-5 max-w-[58ch]">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
