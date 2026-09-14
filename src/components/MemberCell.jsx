import { motion } from 'motion/react'
import { blockNo, isRealLink } from '../lib/chain'
import { initials } from '../lib/initials'
import { SLAM, Scramble, useReveal } from './motion'

// One cell in a `.cells` grid. The initials block slams in as the cell scrolls into view.
export default function MemberCell({ member, index }) {
  const [ref, active, canAnimate] = useReveal()
  const delay = (index % 5) * 0.06

  return (
    <li ref={ref} className="flex flex-col bg-bone p-5">
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
          <Scramble text={blockNo(index + 1)} delay={delay + 0.1} />
        </span>
      </div>
      <h3 className="t-card mt-5">{member.name}</h3>
      <p className="mt-2 font-mono text-[12.5px] font-medium lowercase">{member.role}</p>
      <p className="meta mt-1">
        {member.department.toLowerCase()} · {member.year.toLowerCase()}
      </p>
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
    </li>
  )
}
