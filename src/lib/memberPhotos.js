// Member photos, dropped in rather than wired up.
//
// Name the file after the member's `slug` in src/data/members.js — src/assets/members/arjun-k.jpg —
// and it appears on their cell and their page. Nothing else has to change, and a member without a
// photo simply keeps their initials block, so the roster can be filled in one face at a time.
//
// `npm run photos` then turns it into the pair that is committed: <slug>.webp for the member's page and
// <slug>-thumb.webp for the roster cells (scripts/optimize-member-photos.js).
//
// Vite resolves, hashes and copies every match at build time; the glob is static because it has to be
// statically analysable, which is also why the extensions are spelled out rather than passed in.
const files = import.meta.glob('../assets/members/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  // no-inline: Vite would otherwise write any thumbnail under 4kB into the script itself as base64, and every
  // page that shows one member would download all of them.
  query: '?url&no-inline',
  import: 'default',
})

// Keyed by file name without its extension: "arjun-k" and "arjun-k-thumb".
const photos = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase(),
    url,
  ])
)

// The member's own page.
export const photoFor = (slug) => photos[slug] ?? null

// The roster cells, which show a face at 56px. A photo that has only just been dropped in has no small
// copy yet, so it uses the full one until `npm run photos` has made it.
export const thumbFor = (slug) => photos[`${slug}-thumb`] ?? photoFor(slug)
