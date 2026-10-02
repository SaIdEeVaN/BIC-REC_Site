import { Link, useParams } from 'react-router-dom'
import { Button, Chip, Confirmations, EmptyState, Ledger, LedgerRow } from '../components/kit'
import { Magnetic, Reveal, Scramble, SplitText, Stamp, Wipe } from '../components/motion'
import { events, getEventById, isUpcoming } from '../data/events'
import { albums } from '../data/gallery'
import { blockNo, isRealLink, sealedDate, shortHash, stripEmoji } from '../lib/chain'
import { thumbUrl } from '../lib/galleryPhotos'

// The event's album from the gallery: its first four photos, and the way to the rest.
function EventPhotos({ album }) {
  return (
    <>
      <ul className="cells grid grid-cols-2 md:grid-cols-4">
        {album.photos.slice(0, 4).map((photo) => (
          <li key={photo.n} className="bg-ink">
            <img
              src={thumbUrl(album, photo)}
              alt={photo.alt}
              width="960"
              height="640"
              loading="lazy"
              decoding="async"
              className="block aspect-[3/2] w-full object-cover"
            />
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Button variant="onInk" to={`/gallery#${album.slug}`}>
          All {album.photos.length} photos in the gallery
        </Button>
      </div>
    </>
  )
}

function Block({ title, children }) {
  return (
    <section className="border-b-3 border-ink py-8 last:border-b-0 md:py-10">
      <h2 className="t-h3 mb-6">
        <SplitText text={title} trigger="view" />
      </h2>
      <Reveal delay={120}>{children}</Reveal>
    </section>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const event = getEventById(id)

  if (!event) {
    return (
      <div className="wrap section">
        <EmptyState
          title="Event not found"
          body="There's no event at this address. It may have been renamed or removed."
          action={<Button variant="onInk" to="/events">Back to events</Button>}
        />
      </div>
    )
  }

  const upcoming = isUpcoming(event)
  const album = albums.find((a) => a.slug === event.album)
  // Depth: blocks sealed after this one. An event that hasn't happened has none — nothing is built on it.
  const confirmations = events.filter((e) => e.id > event.id && !isUpcoming(e)).length
  const canRegister = upcoming && isRealLink(event.registrationLink)
  const registration = canRegister ? 'Open' : upcoming ? 'Opens soon' : 'Closed'

  return (
    <>
      <header className="border-b-3 border-ink">
        <div className="wrap section">
          <Link to="/events" className="font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4">
            ← back to events
          </Link>
          <p className="meta mt-8">
            <Scramble
              trigger="mount"
              duration={1}
              text={`${blockNo(event.id)} · ${shortHash(event.slug)} · ${
                upcoming ? 'pending' : `sealed ${sealedDate(event.date)}`
              }`}
            />
          </p>
          <h1 className="t-title t-title-fluid mt-4 max-w-[17ch]">
            <SplitText text={event.title} delay={0.15} />
          </h1>
          <div className="mt-7 flex flex-wrap gap-2">
            <Stamp trigger="mount" delay={0.6}>
              <Chip tone={upcoming ? 'pending' : 'confirmed'}>{upcoming ? 'Upcoming' : 'Sealed'}</Chip>
            </Stamp>
            <Stamp trigger="mount" delay={0.68}>
              <Chip>{event.type}</Chip>
            </Stamp>
            {event.certificate && (
              <Stamp trigger="mount" delay={0.76}>
                <Chip>Certificate provided</Chip>
              </Stamp>
            )}
          </div>
        </div>
      </header>

      <div className="wrap grid lg:grid-cols-[1fr_300px]">
        <div className="border-ink lg:border-r-3 lg:pr-10">
          <Block title="About the event">
            {event.about.split('\n\n').map((para, i) => (
              <p key={i} className="t-body mt-4 max-w-[68ch] first:mt-0">{para}</p>
            ))}
          </Block>

          {event.highlights?.length > 0 && (
            <Block title="Highlights">
              <ul className="border-3 border-ink">
                {event.highlights.map((h, i) => (
                  <li key={h} className="t-small border-t-3 border-ink px-4 py-3 first:border-t-0">
                    <Wipe delay={i * 0.06} className="flex gap-4">
                      <span aria-hidden="true" className="mt-[7px] h-2.5 w-2.5 shrink-0 bg-ink" />
                      {h}
                    </Wipe>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {event.winners?.length > 0 && (
            <Block title="Winners">
              <Ledger from="xl" head={['place', 'team · project', 'prize', 'block']}>
                {event.winners.map((w, i) => (
                  <LedgerRow
                    key={w.team}
                    index={i}
                    tone={i === 0 ? 'pending' : 'confirmed'}
                    date={stripEmoji(w.position)}
                    main={
                      <>
                        <h3 className="t-row">{w.team}</h3>
                        <p className="t-small mt-2">{w.project}</p>
                      </>
                    }
                    side={<span className="text-[18px] font-black">{w.prize}</span>}
                    status={<span className={`meta ${i === 0 ? 'text-coal' : ''}`}>{shortHash(w.team)}</span>}
                  />
                ))}
              </Ledger>
            </Block>
          )}

          <Block title="Event photos">
            {album ? (
              <EventPhotos album={album} />
            ) : (
              <EmptyState
                title="Photos pending"
                body={
                  upcoming
                    ? 'Photos will be added after the event.'
                    : 'Photos from this event haven’t been uploaded yet.'
                }
                action={<Button variant="onInk" to="/gallery">Open the gallery</Button>}
              />
            )}
          </Block>
        </div>

        <aside className="order-first border-b-3 border-ink py-8 lg:order-last lg:border-b-0 lg:pl-8">
          <div className="lg:sticky lg:top-[100px]">
            <Reveal as="div">
              <dl className="border-3 border-ink">
                {[
                  ['date', event.date],
                  ['time', event.time],
                  ['venue', event.venue],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label} className="border-t-3 border-ink px-4 py-3 first:border-t-0">
                      <dt className="meta">{label}</dt>
                      <dd className="mt-1 text-[15px] font-bold">{value}</dd>
                    </div>
                  ))}
                <div className={`border-t-3 border-ink px-4 py-3 ${upcoming ? 'bg-amber text-coal' : ''}`}>
                  <dt className={`meta ${upcoming ? 'text-coal' : ''}`}>registration</dt>
                  <dd className="mt-1 font-mono text-[12.5px] font-medium uppercase">{registration}</dd>
                </div>
              </dl>
            </Reveal>

            <Confirmations count={confirmations} className="mt-7" />

            {canRegister && (
              <div className="mt-7">
                <Magnetic className="block">
                  <Button href={event.registrationLink} className="w-full">Register now</Button>
                </Magnetic>
              </div>
            )}

            {event.speakers?.length > 0 && (
              <Reveal className="mt-9">
                <h2 className="meta">speakers</h2>
                <ul className="mt-3 border-3 border-ink">
                  {event.speakers.map((sp) => (
                    <li key={sp.name} className="border-t-3 border-ink p-4 first:border-t-0">
                      <p className="text-[16px] font-extrabold uppercase leading-tight tracking-[-.02em]">{sp.name}</p>
                      <p className="mt-1 font-mono text-[12px] font-medium lowercase">{sp.role}</p>
                      {sp.bio && <p className="t-small mt-2">{sp.bio}</p>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
