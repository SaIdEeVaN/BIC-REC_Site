import { useState } from 'react'
import { Button, Chip, EmptyState, InkCTA, PageHeader, Tabs } from '../components/kit'
import { Scramble, SplitText } from '../components/motion'
import StackChart from '../components/StackChart'
import { projects, projectCategories } from '../data/projects'
import { blockNo, isRealLink, pad2, shortHash, stripEmoji } from '../lib/chain'

const categories = ['All', ...projectCategories]

// Builds list: 1fr 300px rows separated by 3px rules — no cards.
function BuildRow({ project }) {
  const live = project.status === 'live'
  const links = [
    ['GitHub', project.github],
    ['Live demo', project.demo],
  ].filter(([, href]) => isRealLink(href))

  return (
    <li className="grid border-t-3 border-ink first:border-t-0 lg:grid-cols-[1fr_300px]">
      <div className="py-7 md:py-9 lg:pr-10">
        <p className="meta">
          {blockNo(project.id)} · {project.category}
        </p>
        <h2 className="t-h2 mt-3">
          <SplitText text={project.name} trigger="view" />
        </h2>
        <p className="t-lead mt-3 font-bold">{project.tagline}</p>
        <p className="t-small mt-5 max-w-[68ch]">
          <span className="mr-2 font-mono text-[12px] font-medium">problem:</span>
          {project.problem}
        </p>
        <p className="t-small mt-3 max-w-[68ch]">{project.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tech.map((t) => (
            <li key={t}>
              <Chip lower>{t}</Chip>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6 border-t-3 border-ink py-7 md:py-9 lg:border-l-3 lg:border-t-0 lg:pl-8">
        <Chip tone={live ? 'shipped' : 'pending'} className="self-start">
          {live ? 'Shipped' : 'Building'}
        </Chip>
        {project.awards && <p className="text-[15px] font-bold leading-snug">{stripEmoji(project.awards)}</p>}
        <div>
          <p className="meta">team</p>
          <ul className="t-small mt-2">
            {project.team.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-extrabold uppercase underline decoration-[3px] underline-offset-[5px]"
              >
                {label}
              </a>
            ))}
          </div>
        )}
        <p className="meta mt-auto">
          <Scramble text={shortHash(project.name)} />
        </p>
      </div>
    </li>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const shipped = projects.filter((p) => p.status === 'live').length

  return (
    <>
      <PageHeader
        eyebrow="student innovation"
        title="From ideas to innovation"
        lead="Real projects built by BIC members, tackling real-world problems with blockchain technology."
        aside={[
          ['builds', pad2(projects.length)],
          ['shipped', pad2(shipped)],
          ['building', pad2(projects.length - shipped)],
        ]}
      />

      <section>
        <div className="wrap section">
          <Tabs label="Filter projects by category" options={categories} value={filter} onChange={setFilter} className="mb-8" />
          {filtered.length > 0 ? (
            <>
              <StackChart projects={filtered} />
              <ul className="mt-12 border-y-3 border-ink">
                {filtered.map((project) => (
                  <BuildRow key={project.id} project={project} />
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="Nothing built here yet"
              body="No projects in this category so far. Pitch an idea and the technical team will help you build it."
              action={<Button variant="onInk" to="/contact">Pitch a project</Button>}
            />
          )}
        </div>
      </section>

      <InkCTA
        title="Have a project idea?"
        body="Work with us! Pitch your blockchain project idea to the BIC Technical Team. We provide mentorship, resources, and a community to help you build and launch it."
      >
        <Button to="/contact" variant="onInk">Get in touch</Button>
      </InkCTA>
    </>
  )
}
