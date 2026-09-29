import { useState } from 'react'
import { Button, ChainRail, Chip, InkCTA, Ledger, LedgerRow, PageHeader, Tabs } from '../components/kit'
import { resources } from '../data/resources'
import { hostOf, pad2 } from '../lib/chain'

const tabs = Object.keys(resources)
const total = tabs.reduce((sum, tab) => sum + resources[tab].length, 0)

export default function Resources() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <>
      <PageHeader
        eyebrow="learning resources"
        title="Learn. Build. Explore."
        lead="Handpicked resources curated by the BIC team to help you master Blockchain and Web3."
        aside={[
          ['resources', pad2(total)],
          ['tracks', pad2(tabs.length)],
        ]}
      />

      <section>
        <div className="wrap section">
          <Tabs label="Resource track" options={tabs} value={activeTab} onChange={setActiveTab} className="mb-8" />
          {/* Keyed on the track, so switching tracks draws that track's chain again from scratch. */}
          <ChainRail key={activeTab} nodes={resources[activeTab].length} className="-mt-3 mb-4" />
          <Ledger head={['type', 'resource', 'source', 'link']}>
            {resources[activeTab].map((r, i) => (
              <LedgerRow
                key={r.url}
                index={i}
                href={r.url}
                date={<Chip>{r.type}</Chip>}
                main={
                  <>
                    <h3 className="t-row underline decoration-2 underline-offset-[5px] group-hover:decoration-[3px]">{r.title}</h3>
                    <p className="t-small mt-2">{r.description}</p>
                  </>
                }
                side={<span className="font-mono text-[12.5px] break-all">{hostOf(r.url)}</span>}
                status={
                  <>
                    Open ↗<span className="sr-only"> (opens in a new tab)</span>
                  </>
                }
              />
            ))}
          </Ledger>
        </div>
      </section>

      <InkCTA title="Know a great resource?" body="Suggest a resource to be added to our community library.">
        <Button to="/contact" variant="onInk">Suggest a resource</Button>
      </InkCTA>
    </>
  )
}
