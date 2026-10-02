// The club's photo albums, newest first.
//
// Each album's photos live in src/assets/gallery/<slug>/ as <nn>.webp (the full view, 1600px wide) and
// <nn>-thumb.webp (the grid, 960px wide), web-sized and stripped of all metadata before they're added (see the
// README in that folder). `photos` lists them in page order: `n` is the file number, `alt` describes the photo
// for screen readers, and `caption` is shown under it in the full view.
export const albums = [
  {
    slug: 'kbaic-inauguration-2025',
    title: 'KBAIC Inauguration Ceremony',
    date: 'September 18, 2025',
    datetime: '2025-09-18',
    tags: ['inauguration', 'as KBA Club REC'],
    description:
      'Where it all started: the club’s inauguration, held as KBA Club REC with the Department of Computer Science and Engineering under the theme “Unlocking the Future of Blockchain”. The club has since been renamed the Blockchain Innovation Club.',
    photos: [
      {
        n: 1,
        alt: 'Five guests seated on stage beneath a large screen announcing the KBAIC Inauguration Ceremony.',
        caption: 'The dais, beneath the inauguration screen.',
      },
      { n: 2, alt: 'A guest is welcomed on stage with a bouquet of roses.', caption: 'A welcome with flowers.' },
      {
        n: 3,
        alt: 'A speaker addresses the hall from the Rajalakshmi Engineering College podium.',
        caption: 'Addressing the hall.',
      },
      { n: 4, alt: 'Students in black blazers applaud from the front row of a packed hall.', caption: 'The front row.' },
      { n: 5, alt: 'Rows of students fill the hall for the inauguration.', caption: 'A full house.' },
    ],
  },
]

export const photoCount = albums.reduce((total, album) => total + album.photos.length, 0)
