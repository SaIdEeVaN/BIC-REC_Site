import { useState } from 'react'
import { motion } from 'motion/react'
import { Tabs } from './kit'
import { CountUp, SLAM, SNAP, useReveal } from './motion'

const MAX_BARS = 8

function tally(projects) {
  const byTool = new Map()
  for (const project of projects) {
    for (const tool of project.tech) {
      if (!byTool.has(tool)) byTool.set(tool, [])
      byTool.get(tool).push(project.name)
    }
  }
  return [...byTool]
    .map(([tool, builds]) => ({ tool, builds }))
    .sort((a, b) => b.builds.length - a.builds.length || a.tool.localeCompare(b.tool))
}

// Single-series horizontal bar chart: how many of the listed builds use each tool.
// One colour (ink), value at every bar tip instead of gridlines, amber + hard shadow on the hovered bar.
// Square bar ends and no hairline grid are deliberate — DESIGN_SYSTEM.md forbids radius and 1px rules.
export default function StackChart({ projects }) {
  const rows = tally(projects)
  const total = projects.length
  const shown = rows.slice(0, MAX_BARS)
  const rest = rows.length - shown.length
  const [view, setView] = useState('Chart')
  const [hovered, setHovered] = useState(null)
  const [ref, active, canAnimate] = useReveal({ amount: 0.2 })

  return (
    <section aria-labelledby="stack-title" className="border-3 border-ink p-5 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="stack-title" className="t-h3">What we build with</h2>
          <p className="meta mt-2">
            share of {total} {total === 1 ? 'build' : 'builds'} using each tool
          </p>
        </div>
        <Tabs label="Show the stack as" options={['Chart', 'Table']} value={view} onChange={setView} />
      </div>

      {view === 'Chart' ? (
        <>
          <div ref={ref} role="list" className="mt-10 flex flex-col gap-2" onPointerLeave={() => setHovered(null)}>
            {shown.map((row, i) => {
              const count = row.builds.length
              const lit = hovered === row.tool
              return (
                <div
                  key={row.tool}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${row.tool}: used in ${count} of ${total} builds — ${row.builds.join(', ')}`}
                  className="relative grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 py-1 focus-visible:outline-offset-2 md:grid-cols-[10rem_1fr_3.5rem]"
                  onPointerEnter={() => setHovered(row.tool)}
                  onFocus={() => setHovered(row.tool)}
                  onBlur={() => setHovered(null)}
                >
                  <span aria-hidden="true" className="break-words font-mono text-[12.5px] font-medium lowercase">
                    {row.tool}
                  </span>
                  <span aria-hidden="true" className="relative h-5">
                    <motion.span
                      className={`absolute inset-y-0 left-0 origin-left ${
                        lit ? 'bg-amber shadow-[3px_3px_0_#14110E]' : 'bg-ink'
                      }`}
                      style={{ width: `${(count / total) * 100}%` }}
                      initial={canAnimate ? { scaleX: 0 } : false}
                      animate={{ scaleX: !canAnimate || active ? 1 : 0 }}
                      transition={{ ...SLAM, delay: i * 0.06 }}
                    />
                  </span>
                  <span aria-hidden="true" className="text-right font-mono text-[12.5px] font-medium">
                    <CountUp value={`${count}/${total}`} delay={i * 0.06} />
                  </span>

                  {lit && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-full right-0 z-10 mb-1 w-max max-w-full border-3 border-ink bg-ink px-3 py-2 text-bone"
                      initial={{ y: 6 }}
                      animate={{ y: 0 }}
                      transition={SNAP}
                    >
                      <p className="text-[15px] font-extrabold leading-tight">
                        {count} of {total} builds
                      </p>
                      <p className="mt-1 font-mono text-[12px] lowercase">{row.builds.join(' · ')}</p>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
          {rest > 0 && (
            <p className="meta mt-5">
              + {rest} more {rest === 1 ? 'tool' : 'tools'} in the table view
            </p>
          )}
        </>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-3 border-ink text-left">
            <caption className="sr-only">Tools used across {total} builds</caption>
            <thead>
              <tr className="bg-ink text-bone">
                {['tool', 'builds', 'used in'].map((label) => (
                  <th key={label} scope="col" className="px-4 py-2.5 font-mono text-[12px] font-medium lowercase">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.tool} className="border-t-3 border-ink">
                  <th scope="row" className="px-4 py-3 text-[15px] font-bold">
                    {row.tool}
                  </th>
                  <td className="px-4 py-3 font-mono text-[12.5px] tabular-nums">
                    {row.builds.length}/{total}
                  </td>
                  <td className="t-small px-4 py-3">{row.builds.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
