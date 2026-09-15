import { forwardRef, useState } from 'react'
import { motion } from 'motion/react'
import { blockNo, isRealLink } from '../lib/chain'
import { initials } from '../lib/initials'
import { LiftCell, SLAM, Scramble, useReveal } from './motion'

// One cell in a `.cells` grid. The initials block slams in as the cell scrolls into view; hovering picks the
// cell up and re-decrypts its block number. `shuffle` + the forwarded ref let a filtered grid reflow it (LiftCell).
// Only name and role are required; department, year, bio and LinkedIn show when present.
// `heading`: the name's heading level, for pages that group cells under their own headings.
const MemberCell = forwardRef(function MemberCell({ member, index, shuffle = false, heading: Heading = 'h3' }, ref) {
  const [revealRef, active, canAnimate] = useReveal()
  const [replay, setReplay] = useState(0)
  const delay = (index % 5) * 0.06

  return (
    <LiftCell ref={ref} shuffle={shuffle} className="bg-bone" onHoverStart={() => setReplay((n) => n + 1)}>
      <div ref={revealRef} className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <motion.span
            aria-hidden="true"
            className="grid h-14 w-14 shrink-0 place-items-center bg-ink text-[20px] font-black tracking-[-.03em] text-bone"
            initial={canAnimate ? { scale: 0 } : false}
            animate={{ scale: !canAnimate || active ? 1 : 0 }}
            transition={{ ...SLAM, delay }}
          >
            {initials(member.name)}
          </motion.span>
          <span className="meta">
            <Scramble text={blockNo(index + 1)} delay={delay + 0.1} replay={replay} />
          </span>
        </div>
        <Heading className="t-card mt-5">{member.name}</Heading>
        <p className="mt-2 font-mono text-[12.5px] font-medium lowercase">{member.role}</p>
        {(member.department || member.year) && (
          <p className="meta mt-1">{[member.department, member.year].filter(Boolean).join(' · ').toLowerCase()}</p>
        )}
        {member.bio && <p className="t-small mt-4">{member.bio}</p>}
        {isRealLink(member.linkedin) && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 self-start text-[13.5px] font-extrabold uppercase underline decoration-[3px] underline-offset-[5px]"
          >
            LinkedIn
          </a>
        )}
      </div>
    </LiftCell>
  )
})

export default MemberCell
