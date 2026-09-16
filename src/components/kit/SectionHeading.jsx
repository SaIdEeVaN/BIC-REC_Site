import { Reveal, SplitText } from '../motion'

// The block rises as one, and the title words shunt up out of their slots as it lands.
// One block motion plus one accent: the eyebrow used to decrypt and the lead used to unseal at the
// same time, which made every section heading on the site arrive as three separate events.
export default function SectionHeading({ eyebrow, title, lead, action }) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <Reveal>
        {eyebrow && <p className="meta mb-4">{eyebrow}</p>}
        <h2 className="t-h2 max-w-[17ch]">
          <SplitText text={title} trigger="view" />
        </h2>
        {lead && <p className="t-lead mt-5 max-w-[58ch]">{lead}</p>}
      </Reveal>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
