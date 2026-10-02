import { LiftCell } from '../motion'
import { pad2 } from '../../lib/chain'
import { thumbUrl } from '../../lib/galleryPhotos'

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

// Spans at lg in the 12-column grid the rows use, written out in full so Tailwind finds them.
const LG_SPAN = { 3: 'lg:col-span-3', 4: 'lg:col-span-4', 6: 'lg:col-span-6', 12: 'lg:col-span-12' }

// How many photos open an album as its block: the lead at double size with the others stacked beside it. Five
// (four beside it, two by two) suits most albums; three or four (one column beside it) suit small ones, and six
// splits as three and three. One or two photos have no block, just a row.
function blockSize(count) {
  if (count <= 2) return 0
  if (count === 4) return 4
  if (count === 3 || count === 6) return 3
  return 5
}

// Photos after the block run in rows of four, or of three when they come in threes; a short last row is widened
// to fill the width, so no count leaves a hole.
function rowSpans(count) {
  const perRow = count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : count % 4 >= 2 ? 4 : 3
  const last = count % perRow
  return Array.from({ length: count }, (_, j) => LG_SPAN[last && j >= count - last ? 12 / last : 12 / perRow])
}

// An album's photos: the block (see blockSize), then the rows (see rowSpans). On phones it's two across with the
// lead full width, and an odd one out at the end of either part takes the full width. Any photo opens the full
// view through `onOpen(button, albumIndex, photoIndex)`.
export default function AlbumPhotos({ album, albumIndex, onOpen }) {
  const count = album.photos.length
  const size = blockSize(count)
  const block = album.photos.slice(0, size)
  const rest = album.photos.slice(size)
  const spans = rowSpans(rest.length)
  const blockColumns = size === 5 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  const leadRows = size === 4 ? 'lg:row-span-3' : 'lg:row-span-2'
  // Two across on phones: the last of an odd run (after the lead, in the block) spans both columns.
  const oddOneOut = (i, first, length) => (length - (first ? 1 : 0)) % 2 === 1 && i === length - 1
  const cell = (photo, i, className) => (
    <PhotoCell
      key={photo.n}
      album={album}
      albumIndex={albumIndex}
      photo={photo}
      i={i}
      lead={size > 0 && i === 0}
      className={className}
      onOpen={onOpen}
    />
  )

  return (
    <>
      {size > 0 && (
        <ul className={`cells grid grid-cols-2 ${blockColumns}`}>
          {block.map((photo, i) =>
            cell(
              photo,
              i,
              i === 0 ? `col-span-2 ${leadRows}` : oddOneOut(i, true, size) ? 'col-span-2 lg:col-span-1' : '',
            ),
          )}
        </ul>
      )}
      {rest.length > 0 && (
        // After a block, pulled up 3px so its top rule and the block's bottom rule are one line, not two.
        <ul className={`cells grid grid-cols-2 lg:grid-cols-12 ${size > 0 ? '-mt-[3px]' : ''}`}>
          {rest.map((photo, j) =>
            cell(photo, size + j, `${oddOneOut(j, false, rest.length) ? 'col-span-2' : ''} ${spans[j]}`),
          )}
        </ul>
      )}
    </>
  )
}
