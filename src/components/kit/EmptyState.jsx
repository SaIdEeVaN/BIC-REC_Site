import { AMBER, Slam, SplitText } from '../motion'

// Full ink panel, amber shadow, one amber CTA. Slams down onto its amber shadow.
export default function EmptyState({ title, body, action }) {
  return (
    <Slam color={AMBER} className="on-ink bg-ink p-7 text-bone shadow-amber md:p-12">
      <h2 className="t-empty max-w-[16ch]">
        <SplitText text={title} trigger="view" delay={0.15} />
      </h2>
      {body && <p className="t-body mt-4 max-w-[52ch]">{body}</p>}
      {action && <div className="mt-8">{action}</div>}
    </Slam>
  )
}
