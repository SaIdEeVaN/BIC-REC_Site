import { Scramble, SplitText, Wipe } from '../motion'

export default function SectionHeading({ eyebrow, title, lead, action }) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="meta mb-4">
            <Scramble text={eyebrow} />
          </p>
        )}
        <h2 className="t-h2 max-w-[17ch]">
          <SplitText text={title} trigger="view" />
        </h2>
        {lead && (
          <Wipe delay={0.2} className="mt-5 w-fit max-w-[58ch]">
            <p className="t-lead">{lead}</p>
          </Wipe>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
