// Member photos, dropped in rather than wired up.
//
// Name the file after the member's `slug` in src/data/members.js — src/assets/members/arjun-k.jpg —
// and it appears on their cell and their page. Nothing else has to change, and a member without a
// photo simply keeps their initials block, so the roster can be filled in one face at a time.
//
// Vite resolves, hashes and copies every match at build time; the glob is static because it has to be
// statically analysable, which is also why the extensions are spelled out rather than passed in.
const files = import.meta.glob('../assets/members/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const photos = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase(),
    url,
  ])
)

export const photoFor = (slug) => photos[slug] ?? null
