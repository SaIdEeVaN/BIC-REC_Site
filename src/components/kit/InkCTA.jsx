import { Children } from 'react'
import { Magnetic, SplitText, Wipe } from '../motion'

// Inverted call-to-action section.
export default function InkCTA({ title, body, aside, children }) {
  return (
    <section className="on-ink bg-ink text-bone">
      <div className="wrap section grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
        <div>
          <h2 className="t-cta max-w-[14ch]">
            <SplitText text={title} trigger="view" />
          </h2>
          {body && (
            <Wipe color="bone" delay={0.25} className="mt-5 w-fit max-w-[52ch]">
              <p className="t-lead">{body}</p>
            </Wipe>
          )}
          {children && (
            <div className="mt-9 flex flex-wrap gap-5">
              {Children.toArray(children).map((child) => (
                <Magnetic key={child.key}>{child}</Magnetic>
              ))}
            </div>
          )}
        </div>
        {aside && (
          <Wipe color="bone" delay={0.4}>
            {aside}
          </Wipe>
        )}
      </div>
    </section>
  )
}
