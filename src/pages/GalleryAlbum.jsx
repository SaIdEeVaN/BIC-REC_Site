import { Link, useParams } from 'react-router-dom'
import { Button, Chip, EmptyState } from '../components/kit'
import { SplitText } from '../components/motion'
import AlbumPhotos from '../components/gallery/AlbumPhotos'
import Viewer from '../components/gallery/Viewer'
import { events } from '../data/events'
import { albums, getAlbumBySlug } from '../data/gallery'
import { pad2 } from '../lib/chain'
import { useViewer } from '../lib/useViewer'

const smallLink = 'font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4 hover:decoration-[3px]'

// One album on a page of its own (/gallery/<slug>): where an event's "Explore gallery" leads, so it opens on that
// event's photos alone rather than the whole gallery.
export default function GalleryAlbum() {
  const { slug } = useParams()
  const album = getAlbumBySlug(slug)
  const { view, open, step, closed } = useViewer()

  if (!album) {
    return (
      <div className="wrap section">
        <EmptyState
          title="Album not found"
          body="There's no album at this address. It may have been renamed or removed."
          action={<Button variant="onInk" to="/gallery">Open the gallery</Button>}
        />
      </div>
    )
  }

  const event = events.find((e) => e.album === album.slug)

  return (
    <>
      <header className="border-b-3 border-ink">
        <div className="wrap section">
          <Link to="/gallery" className={smallLink}>
            ← all albums
          </Link>
          <p className="meta mt-8">
            <time dateTime={album.datetime}>{album.date}</time> · {pad2(album.photos.length)} photos
          </p>
          <h1 className="t-title t-title-fluid mt-4 max-w-[17ch]">
            <SplitText text={album.title} delay={0.15} />
          </h1>
          <p className="t-lead mt-6 max-w-[60ch]">{album.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {album.tags?.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Tags">
                {album.tags.map((tag) => (
                  <li key={tag}>
                    <Chip lower>{tag}</Chip>
                  </li>
                ))}
              </ul>
            )}
            {event && (
              <Link to={`/events/${event.id}`} className={smallLink}>
                About the event →
              </Link>
            )}
          </div>
        </div>
      </header>

      <section aria-label="Photos">
        <div className="wrap section">
          <AlbumPhotos album={album} albumIndex={albums.indexOf(album)} onOpen={open} />
        </div>
      </section>

      <Viewer view={view} onStep={step} onClosed={closed} />
    </>
  )
}
