import { Link } from 'react-router-dom'
import { Chip, PageHeader } from '../components/kit'
import { Reveal } from '../components/motion'
import AlbumPhotos from '../components/gallery/AlbumPhotos'
import Viewer from '../components/gallery/Viewer'
import { events } from '../data/events'
import { albumPath, albums, photoCount } from '../data/gallery'
import { pad2 } from '../lib/chain'
import { useViewer } from '../lib/useViewer'

// One album: when and what, then its photos. Its title leads to the album's own page (GalleryAlbum.jsx).
function Album({ album, index, onOpen }) {
  const event = events.find((e) => e.album === album.slug)

  return (
    <section aria-labelledby={`album-${album.slug}`} className="border-b-3 border-ink">
      <div className="wrap section">
        <Reveal className="mb-8 grid gap-6 md:mb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta">
              <time dateTime={album.datetime}>{album.date}</time> · {pad2(album.photos.length)} photos
            </p>
            <h2 id={`album-${album.slug}`} className="t-h2 mt-4 max-w-[20ch]">
              <Link
                to={albumPath(album)}
                className="underline decoration-[3px] underline-offset-[6px] hover:decoration-[5px]"
              >
                {album.title}
              </Link>
            </h2>
            <p className="t-lead mt-5 max-w-[60ch]">{album.description}</p>
            {event && (
              <Link
                to={`/events/${event.id}`}
                className="mt-5 inline-block font-mono text-[12.5px] font-medium underline decoration-2 underline-offset-4 hover:decoration-[3px]"
              >
                About the event →
              </Link>
            )}
          </div>
          {album.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {album.tags.map((tag) => (
                <li key={tag}>
                  <Chip lower>{tag}</Chip>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <AlbumPhotos album={album} albumIndex={index} onOpen={onOpen} />
      </div>
    </section>
  )
}

export default function Gallery() {
  const { view, open, step, closed } = useViewer()

  return (
    <>
      <PageHeader
        eyebrow="visual memories"
        title="Gallery"
        lead="Moments from the club’s events, one album at a time."
        aside={[
          ['albums', pad2(albums.length)],
          ['photos', pad2(photoCount)],
        ]}
      />

      {albums.map((album, i) => (
        <Album key={album.slug} album={album} index={i} onOpen={open} />
      ))}

      <Viewer view={view} onStep={step} onClosed={closed} />
    </>
  )
}
