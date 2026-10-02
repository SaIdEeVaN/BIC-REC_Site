import { useEffect, useRef, useState } from 'react'
import { Button, Chip, PageHeader } from '../components/kit'
import { LiftCell, Reveal } from '../components/motion'
import { albums, photoCount } from '../data/gallery'
import { pad2 } from '../lib/chain'
import { photoUrl, thumbUrl } from '../lib/galleryPhotos'

// The full view: a modal <dialog> over the page, so Esc closes it and focus stays inside while it's open. The
// buttons or the arrow keys step through the album (wrapping round), and the page behind doesn't scroll.
function Viewer({ view, onStep, onClosed }) {
  const ref = useRef(null)
  const open = view !== null

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  const album = open ? albums[view.album] : null
  const photo = open ? album.photos[view.photo] : null

  function onKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      onStep(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="viewer-title"
      onClose={onClosed}
      onKeyDown={onKeyDown}
      className="on-ink m-0 h-full max-h-none w-full max-w-none border-0 bg-ink p-0 text-bone backdrop:bg-ink"
    >
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b-3 border-bone px-4 py-3 md:px-6">
            <p id="viewer-title" className="meta min-w-0">
              {album.title} · {pad2(view.photo + 1)} / {pad2(album.photos.length)}
            </p>
            <Button variant="ghostOnInk" className="shrink-0" onClick={() => ref.current.close()}>
              Close
            </Button>
          </div>
          <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-5 md:px-8">
            {/* Keyed on the photo, so a slow load never shows the previous one under the new caption. */}
            <img
              key={photoUrl(album, photo)}
              src={photoUrl(album, photo)}
              alt={photo.alt}
              className="min-h-0 w-full flex-1 object-contain"
            />
            <figcaption className="t-body max-w-[60ch] text-center">{photo.caption}</figcaption>
          </figure>
          <div className="flex justify-center gap-5 border-t-3 border-bone px-4 py-4">
            <Button variant="ghostOnInk" onClick={() => onStep(-1)}>
              ← Previous
            </Button>
            <Button variant="ghostOnInk" onClick={() => onStep(1)}>
              Next →
            </Button>
          </div>
        </div>
      )}
    </dialog>
  )
}

// One photo cell: the thumbnail, its number, and the way into the full view. The lead photo's image is taken out of
// the flow from lg, so its double cell is exactly as tall as the two rows beside it, whatever the photo's shape.
function PhotoCell({ album, albumIndex, photo, i, lead = false, className = '', onOpen }) {
  return (
    <LiftCell index={i} className={`bg-ink ${className}`}>
      <button type="button" className="relative block h-full w-full" onClick={(event) => onOpen(event.currentTarget, albumIndex, i)}>
        <span className="sr-only">Open full size: </span>
        <img
          src={thumbUrl(album, photo)}
          alt={photo.alt}
          width="960"
          height="640"
          loading={lead ? 'eager' : 'lazy'}
          decoding="async"
          className={`block aspect-[3/2] w-full object-cover ${lead ? 'lg:absolute lg:inset-0 lg:aspect-auto lg:h-full' : ''}`}
        />
        <span
          aria-hidden="true"
          className="meta absolute left-0 top-0 border-b-3 border-r-3 border-ink bg-bone px-2 py-1 text-ink"
        >
          #{pad2(i + 1)}
        </span>
      </button>
    </LiftCell>
  )
}

// One album: when and what, then its photos. The first five make a block: the lead at double size (two columns
// by two rows from lg) with four beside it. The rest follow in rows of four, or of three when they come in threes,
// and on phones an odd one out at the end takes the full width, so no row is left with a hole in it.
function Album({ album, index, onOpen }) {
  const count = album.photos.length
  const head = album.photos.slice(0, 5)
  const rest = album.photos.slice(5)
  const restColumns = rest.length % 4 !== 0 && rest.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  const cell = (photo, i, className) => (
    <PhotoCell
      key={photo.n}
      album={album}
      albumIndex={index}
      photo={photo}
      i={i}
      lead={i === 0}
      className={className}
      onOpen={onOpen}
    />
  )

  return (
    <section aria-labelledby={`album-${album.slug}`} className="border-b-3 border-ink">
      <div className="wrap section">
        <Reveal className="mb-8 grid gap-6 md:mb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta">
              <time dateTime={album.datetime}>{album.date}</time> · {pad2(count)} photos
            </p>
            <h2 id={`album-${album.slug}`} className="t-h2 mt-4 max-w-[20ch]">
              {album.title}
            </h2>
            <p className="t-lead mt-5 max-w-[60ch]">{album.description}</p>
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

        <ul className="cells grid grid-cols-2 lg:grid-cols-4">
          {head.map((photo, i) => cell(photo, i, i === 0 ? 'col-span-2 lg:row-span-2' : ''))}
        </ul>
        {rest.length > 0 && (
          // Pulled up 3px so its top rule and the block's bottom rule are one line, not two.
          <ul className={`cells -mt-[3px] grid grid-cols-2 ${restColumns}`}>
            {rest.map((photo, j) =>
              cell(photo, j + 5, rest.length % 2 === 1 && j === rest.length - 1 ? 'col-span-2 lg:col-span-1' : ''),
            )}
          </ul>
        )}
      </div>
    </section>
  )
}

export default function Gallery() {
  // { album, photo } while the full view is open, null otherwise.
  const [view, setView] = useState(null)
  // The photo that opened the full view gets focus back when it closes.
  const opener = useRef(null)

  function open(button, album, photo) {
    opener.current = button
    setView({ album, photo })
  }

  function step(delta) {
    setView((current) => {
      const count = albums[current.album].photos.length
      return { ...current, photo: (current.photo + delta + count) % count }
    })
  }

  function closed() {
    setView(null)
    opener.current?.focus()
  }

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
