// The club's photo albums, newest first.
//
// Each album's photos live in src/assets/gallery/<slug>/ as <nn>.webp (the full view, 1600px wide) and
// <nn>-thumb.webp (the grid, 960px wide), web-sized and stripped of all metadata before they're added (see the
// README in that folder). `photos` lists them in page order: `n` is the file number, `alt` describes the photo
// for screen readers, and `caption` is shown under it in the full view.
export const albums = [
  {
    slug: 'decode-blockchain-2025',
    title: 'Decode Blockchain',
    date: 'October 15, 2025',
    datetime: '2025-10-15',
    tags: ['workshop', 'first event'],
    description:
      'The club’s first event: Decode Blockchain, a hands-on workshop organised by the Blockchain Innovation Club with the Department of Computer Science and Engineering, under the theme “Unlocking the Future of Blockchain”.',
    photos: [
      {
        n: 1,
        alt: 'Club members and faculty stand with the speaker, who holds a bouquet, in front of a screen announcing the BIC workshop.',
        caption: 'With the speaker, in front of the workshop screen.',
      },
      { n: 2, alt: 'Participants follow the session at their laptops in a classroom.', caption: 'Hands-on, laptops open.' },
      {
        n: 3,
        alt: 'The organising team poses with the faculty and the speaker in the classroom.',
        caption: 'Everyone who made it happen.',
      },
      {
        n: 4,
        alt: 'Members of the organising team stand with the speaker in front of the classroom screen.',
        caption: 'The team with the speaker.',
      },
      {
        n: 5,
        alt: 'Six members of the organising team in club shirts and lanyards, standing under the palms outside.',
        caption: 'The crew, outside.',
      },
    ],
  },
  {
    slug: 'kbaic-inauguration-2025',
    title: 'KBAIC Inauguration Ceremony',
    date: 'September 18, 2025',
    datetime: '2025-09-18',
    tags: ['inauguration', 'first board', 'as KBA Club REC'],
    description:
      'Where it all started: the inauguration of the club, then the Kerala Blockchain Academy Club REC (KBA Club REC), and of its first board. It was held with the Department of Computer Science and Engineering under the theme “Unlocking the Future of Blockchain”. The club has since been renamed the Blockchain Innovation Club.',
    photos: [
      {
        n: 1,
        alt: 'The first board, in black blazers, gathered with the guests and faculty on the steps outside the REC Tech Lounge.',
        caption: 'The first board, with the guests and faculty.',
      },
      {
        n: 2,
        alt: 'Five guests seated on stage beneath a large screen announcing the KBAIC Inauguration Ceremony.',
        caption: 'The dais, beneath the inauguration screen.',
      },
      { n: 3, alt: 'A guest is welcomed on stage with a bouquet of roses.', caption: 'A welcome with flowers.' },
      {
        n: 4,
        alt: 'A speaker addresses the hall from the Rajalakshmi Engineering College podium.',
        caption: 'Addressing the hall.',
      },
      {
        n: 5,
        alt: 'Appointment letters and name badges laid out in rows on a table, branded KBA REC.',
        caption: 'Appointment letters and badges for the first board.',
      },
      { n: 6, alt: 'Students in black blazers applaud from the front row of a packed hall.', caption: 'The front row.' },
      { n: 7, alt: 'Rows of students fill the hall for the inauguration.', caption: 'A full house.' },
      { n: 8, alt: 'Students in black blazers seated in a tiered lecture hall.', caption: 'In the lecture hall.' },
      { n: 9, alt: 'Three students in black blazers listen from the front desk of a lecture hall.', caption: 'Listening in.' },
    ],
  },
]

export const photoCount = albums.reduce((total, album) => total + album.photos.length, 0)
