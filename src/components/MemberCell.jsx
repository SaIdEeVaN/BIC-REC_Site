import { forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { blockNo } from '../lib/chain'
import { initials } from '../lib/initials'
import { photoFor } from '../lib/memberPhotos'
import { LiftCell, SLAM, Scramble, stagger, useReveal } from './motion'

// One cell in a `.cells` grid, and the way into a member's own page. The portrait slams in as the cell
// scrolls into view; hovering picks the cell up and re-decrypts its block number.
//
// The whole cell is the link, so nothing inside it may be one — a member's LinkedIn and Instagram live
// on their page rather than here. `shuffle` + the forwarded ref let a filtered grid reflow it (LiftCell).
// `heading`: the name's heading level, for pages that group cells under their own headings.
const MemberCell = forwardRef(function MemberCell({ member, index, shuffle = false, heading: Heading = 'h3' }, ref) {
  const [revealRef, active, canAnimate] = useReveal()
  const [replay, setReplay] = useState(0)
  const delay = stagger(index % 5)
  const photo = photoFor(member.slug)

  return (
    <LiftCell ref={ref} shuffle={shuffle} className="bg-bone" onHoverStart={() => setReplay((n) => n + 1)}>
      {/* The observer watches the link, not the cell: LiftCell's own reveal offsets the cell itself. */}
      <Link ref={revealRef} to={`/team/board/${member.slug}`} className="group flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <motion.span
            aria-hidden="true"
            className="block h-14 w-14 shrink-0 overflow-hidden border-3 border-ink bg-ink"
            initial={canAnimate ? { scale: 0 } : false}
            animate={{ scale: !canAnimate || active ? 1 : 0 }}
            transition={{ ...SLAM, delay }}
          >
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="grid h-full w-full place-items-center text-[20px] font-black tracking-[-.03em] text-bone">
                {initials(member.name)}
              </span>
            )}
          </motion.span>
          <span className="meta">
            <Scramble text={blockNo(index + 1)} delay={delay + 0.1} replay={replay} />
          </span>
        </div>
        <Heading className="t-card mt-5 underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">
          {member.name}
        </Heading>
        {member.role && <p className="mt-2 font-mono text-[12.5px] font-medium lowercase">{member.role}</p>}
        {(member.department || member.year) && (
          <p className="meta mt-1">{[member.department, member.year].filter(Boolean).join(' · ').toLowerCase()}</p>
        )}
        {member.bio && <p className="t-small mt-4">{member.bio}</p>}
        <span className="meta mt-auto pt-5">view details →</span>
      </Link>
    </LiftCell>
  )
})

export default MemberCell
