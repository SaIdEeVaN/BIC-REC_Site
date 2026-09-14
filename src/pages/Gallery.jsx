import { useState } from 'react'
import { PageHeader, Tabs } from '../components/kit'
import { blockNo, pad2 } from '../lib/chain'

const allPhotos = [
  { id: 1, category: 'Workshops', title: 'Blockchain Fundamentals Workshop', date: 'Jan 2026' },
  { id: 2, category: 'Workshops', title: 'Smart Contract Session', date: 'Apr 2026' },
  { id: 3, category: 'Hackathons', title: 'Web3 Hackathon 2026', date: 'Feb 2026' },
  { id: 4, category: 'Hackathons', title: 'Hackathon Final Presentations', date: 'Feb 2026' },
  { id: 5, category: 'Guest Sessions', title: 'DeFi Expert Session', date: 'Mar 2026' },
  { id: 6, category: 'Guest Sessions', title: 'KBA Expert Talk', date: 'Nov 2024' },
  { id: 7, category: 'Team Moments', title: 'Core Team Meeting', date: 'Dec 2025' },
  { id: 8, category: 'Team Moments', title: 'Club Founding Day', date: '2024' },
  { id: 9, category: 'Events', title: 'Certificate Distribution', date: 'Jan 2026' },
  { id: 10, category: 'Events', title: 'Community Meetup Prep', date: 'May 2026' },
  { id: 11, category: 'Club Activities', title: 'Design Team at Work', date: 'Mar 2026' },
  { id: 12, category: 'Club Activities', title: 'Technical Team Workshop', date: 'Feb 2026' },
]

const galleryCats = ['All', 'Workshops', 'Hackathons', 'Guest Sessions', 'Events', 'Team Moments', 'Club Activities']

// Crossed frame = a reserved photo slot. Swap for an <img> once real photos are added.
function FrameMark() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#14110E" strokeWidth="3" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="#14110E" strokeWidth="3" />
    </svg>
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? allPhotos : allPhotos.filter((p) => p.category === filter)

  return (
    <>
      <PageHeader
        eyebrow="visual memories"
        title="Gallery"
        lead="Memories that matter — a visual collection of the club's activities and achievements."
        aside={[
          ['frames', pad2(allPhotos.length)],
          ['categories', pad2(galleryCats.length - 1)],
        ]}
      />

      <section>
        <div className="wrap section">
          <Tabs label="Filter photos by category" options={galleryCats} value={filter} onChange={setFilter} />
          <p className="meta mt-5">photos are being uploaded — each frame below is reserved for one.</p>
          <ul className="cells mt-8 grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((photo) => (
              <li key={photo.id} className="flex flex-col bg-bone">
                <div className="relative aspect-[4/3] border-b-3 border-ink">
                  <FrameMark />
                  <span className="meta absolute left-0 top-0 border-b-3 border-r-3 border-ink bg-bone px-2 py-1 text-ink">
                    {blockNo(photo.id)}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="t-row">{photo.title}</h2>
                  <p className="meta mt-2">
                    {photo.date} · {photo.category}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
