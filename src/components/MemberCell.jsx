import { blockNo, isRealLink } from '../lib/chain'
import { initials } from '../lib/initials'

// One cell in a `.cells` grid.
export default function MemberCell({ member, index }) {
  return (
    <li className="flex flex-col bg-bone p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center bg-ink text-[20px] font-black tracking-[-.03em] text-bone"
        >
          {initials(member.name)}
        </span>
        <span className="meta">{blockNo(index + 1)}</span>
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
