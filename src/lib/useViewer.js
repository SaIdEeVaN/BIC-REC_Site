import { useRef, useState } from 'react'
import { albums } from '../data/gallery'

// State for the gallery's full view (components/gallery/Viewer.jsx): which photo of which album is open, if any.
// `open` is handed to AlbumPhotos; the photo that opened the view gets focus back when it closes.
export function useViewer() {
  // { album, photo } (indexes into `albums` and its photos) while the full view is open, null otherwise.
  const [view, setView] = useState(null)
  const opener = useRef(null)

  function open(button, album, photo) {
    opener.current = button
    setView({ album, photo })
  }

  // Steps through the album, wrapping round at either end.
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

  return { view, open, step, closed }
}
