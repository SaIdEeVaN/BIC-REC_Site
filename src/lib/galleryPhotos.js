// Gallery photos, resolved by album and number: src/assets/gallery/<slug>/<nn>.webp and <nn>-thumb.webp.
// Vite hashes and copies every match at build time; the glob is static because it has to be statically analysable.
const files = import.meta.glob('../assets/gallery/*/*.webp', { eager: true, query: '?url', import: 'default' })

const urls = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').slice(-2).join('/').replace(/\.webp$/, ''), url]),
)

const nn = (n) => String(n).padStart(2, '0')

export const photoUrl = (album, photo) => urls[`${album.slug}/${nn(photo.n)}`]
export const thumbUrl = (album, photo) => urls[`${album.slug}/${nn(photo.n)}-thumb`] ?? photoUrl(album, photo)
