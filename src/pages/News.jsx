import { useState } from 'react'
import { Button, Chip, EmptyState, InkCTA, Ledger, LedgerRow, PageHeader, Tabs } from '../components/kit'
import { Mine, Scramble } from '../components/motion'
import { news, newsCategories } from '../data/news'
import { shortHash } from '../lib/chain'
import { CLUB_INSTAGRAM, CLUB_LINKEDIN } from '../data/club'

const categories = ['All', ...newsCategories]

export default function News() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? news : news.filter((n) => n.category === filter)

  return (
    <>
      <PageHeader
        eyebrow="latest updates"
        title="What's happening?"
        lead="Stay updated with the latest news, announcements, and achievements from the Blockchain Innovation Club."
      />

      <section>
        <div className="wrap section">
          <Tabs label="Filter news by category" options={categories} value={filter} onChange={setFilter} className="mb-8" />
          {filtered.length > 0 ? (
            <Ledger head={['date', 'update', 'category', 'status']}>
              {filtered.map((item, i) => {
                const internal = item.link?.startsWith('/')
                const latest = i === 0
                return (
                  <LedgerRow
                    key={item.id}
                    index={i}
                    to={internal ? item.link : undefined}
                    tone={latest ? 'pending' : 'confirmed'}
                    date={item.date}
                    main={
                      <>
                        <h3 className={`t-row ${internal ? 'decoration-[3px] underline-offset-[5px] group-hover:underline' : ''}`}>
                          {item.title}
                        </h3>
                        <p className="t-small mt-2">{item.description}</p>
                      </>
                    }
                    side={<Chip>{item.category}</Chip>}
                    status={
                      <>
                        <span className="block">{internal ? 'Read more' : latest ? 'Latest' : 'Sealed'}</span>
                        {/* The newest update is the head of the chain — its hash is still being found. */}
                        <span className={`meta mt-2 block ${latest ? 'text-ink' : ''}`}>
                          {latest ? (
                            <Mine text={shortHash(item.title)} />
                          ) : (
                            <Scramble text={shortHash(item.title)} delay={i * 0.07 + 0.3} />
                          )}
                        </span>
                      </>
                    }
                  />
                )
              })}
            </Ledger>
          ) : (
            <EmptyState
              title="No news in this category yet"
              body="Nothing has been posted here so far. Everything else is in the full feed."
              action={<Button variant="onInk" onClick={() => setFilter('All')}>Show all news</Button>}
            />
          )}
        </div>
      </section>

      <InkCTA title="Stay in the loop" body="Follow us on social media to never miss an update.">
        <Button
          variant="onInk"
          href={CLUB_INSTAGRAM}
        >
          Instagram
        </Button>
        <Button variant="ghostOnInk" href={CLUB_LINKEDIN}>LinkedIn</Button>
      </InkCTA>
    </>
  )
}
