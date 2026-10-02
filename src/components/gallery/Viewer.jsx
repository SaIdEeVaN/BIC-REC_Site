import { useEffect, useRef } from 'react'
import { Button } from '../kit'
import { albums } from '../../data/gallery'
import { pad2 } from '../../lib/chain'
import { photoUrl } from '../../lib/galleryPhotos'

// The full view: a modal <dialog> over the page, so Esc closes it and focus stays inside while it's open. The
// buttons or the arrow keys step through the album (wrapping round), and the page behind doesn't scroll.
export default function Viewer({ view, onStep, onClosed }) {
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
