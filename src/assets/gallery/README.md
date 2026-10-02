# Gallery photos

One folder per album, named after the album's `slug` in `src/data/gallery.js`. In each:

- `01.webp`, `02.webp`, …: the full view, 1600px wide.
- `01-thumb.webp`, `02-thumb.webp`, …: the grid, 960px wide.

Before a photo goes in, it's converted to sRGB, resized, and saved as WebP **with no metadata at all** (no EXIF,
no GPS, no camera details, no colour profile). Everything in this folder is published, so nothing private belongs
here. Then list the photo in the album's `photos` with its number, `alt` text and `caption`.
