// The club's photo albums, newest first.
//
// Each album's photos live in src/assets/gallery/<slug>/ as <nn>.webp (the full view, 1600px wide) and
// <nn>-thumb.webp (the grid, 960px wide), web-sized and stripped of all metadata before they're added (see the
// README in that folder). `photos` lists them in page order: `n` is the file number, `alt` describes the photo
// for screen readers, and `caption` is shown under it in the full view.
export const albums = [
  {
    slug: 'defi-unlocked-2026',
    title: 'DeFi Unlocked',
    date: 'April 11, 2026',
    datetime: '2026-04-11',
    tags: ['workshop', 'hands-on'],
    description:
      'DeFi Unlocked, a hands-on workshop: participants set up a wallet, made a transaction, wrote a Solidity smart contract and deployed it to the Sepolia testnet, and made a token of their own.',
    photos: [
      {
        n: 1,
        alt: 'A speaker at the front of a computer lab, with a contract being deployed from Remix and MetaMask projected behind him, as participants work at their screens.',
        caption: 'Deploying a contract, live.',
      },
      { n: 2, alt: 'Rows of participants at computers in a lab during the workshop.', caption: 'A full lab.' },
      {
        n: 3,
        alt: 'A club member with a microphone in front of the closing slide, “Questions? Let’s Talk Blockchain!”, as others look on.',
        caption: 'Questions? Let’s talk blockchain.',
      },
    ],
  },
  {
    slug: 'hack-to-blockchain-2026',
    title: 'Hack to Blockchain',
    date: 'February 13, 2026',
    datetime: '2026-02-13',
    tags: ['titanium 2026', 'with notion'],
    description:
      'Hack to Blockchain at Titanium 2026, the national-level technical symposium at Rajalakshmi Engineering College, with Notion: a session on how a blockchain reaches consensus, then certificates and Notion goodies.',
    photos: [
      {
        n: 1,
        alt: 'A packed hall of participants, club members and faculty in front of the Hack to Blockchain screen.',
        caption: 'Everyone at Hack to Blockchain.',
      },
      {
        n: 2,
        alt: 'A speaker at the front of a hall explains consensus, with the slide “Thousands of computers exist” on screen.',
        caption: 'Who decides which block is correct? Consensus.',
      },
      {
        n: 3,
        alt: 'Club members hand a participant a Notion bag in front of the Hack to Blockchain screen.',
        caption: 'Notion goodies handed over.',
      },
      {
        n: 4,
        alt: 'Club members present a participant with a certificate in front of the Hack to Blockchain screen.',
        caption: 'A certificate on stage.',
      },
      {
        n: 5,
        alt: 'Club members and a faculty member gathered in front of the Hack to Blockchain screen.',
        caption: 'The team behind the event.',
      },
    ],
  },
  {
    slug: 'home-of-hope-visit-2026',
    title: 'Home of Hope Visit',
    date: 'January 26, 2026',
    datetime: '2026-01-26',
    tags: ['outreach', 'community'],
    description:
      'The club visited Home of Hope Children’s Home near Porur, a unit of the Rose Bedeiah Foundation and home to 30 children and 7 staff. The children’s faces are blurred for their privacy.',
    photos: [
      { n: 1, alt: 'The club’s volunteers together outside Home of Hope Children’s Home.', caption: 'The team at Home of Hope.' },
      {
        n: 2,
        alt: 'Club volunteers stand in a line introducing themselves to the children, who sit on the floor facing them. The children’s faces are blurred.',
        caption: 'Getting to know each other.',
      },
      {
        n: 3,
        alt: 'The children sit on the floor in a circle around the club’s volunteers inside the home. The children’s faces are blurred.',
        caption: 'Everyone in one circle.',
      },
    ],
  },
  {
    slug: 'european-immersion-2026',
    title: 'European Immersion Program',
    date: 'January 6, 2026',
    datetime: '2026-01-06',
    tags: ['immersion program', 'international'],
    description:
      'Students from top European institutions came to Rajalakshmi Engineering College for an immersion program in blockchain and quantum cryptography.',
    photos: [
      {
        n: 1,
        alt: 'Faculty, club members and the visiting European students gathered in front of the Idea Factory sign at REC.',
        caption: 'Everyone together at the Idea Factory.',
      },
      {
        n: 2,
        alt: 'Students and a faculty member gather around a desk in front of a screen showing code.',
        caption: 'Gathered round the code.',
      },
      {
        n: 3,
        alt: 'Club members and faculty stand at the front of a lab where every screen shows Blockverse.',
        caption: 'Blockverse on every screen.',
      },
      { n: 4, alt: 'Visiting students at Dell computers in a lab, following the session.', caption: 'Into the session, in the lab.' },
      {
        n: 5,
        alt: 'Visiting students laugh with club members and faculty gathered around a lab computer.',
        caption: 'Laughs around the desk.',
      },
      {
        n: 6,
        alt: 'A club member holds a microphone as a visiting student answers from his desk.',
        caption: 'Questions and answers.',
      },
      {
        n: 7,
        alt: 'Three club members stand beside two visiting students seated at a lab computer.',
        caption: 'Club members with two of the visitors.',
      },
      {
        n: 8,
        alt: 'Two faculty members with three visiting students, who hold up small pins, in the lab.',
        caption: 'With the faculty, in the lab.',
      },
    ],
  },
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
      {
        n: 2,
        alt: 'The speaker and two students look at their laptops, with a crypto wallet open on the screen behind them.',
        caption: 'Setting up a wallet, step by step.',
      },
      { n: 3, alt: 'Participants follow the session at their laptops in a classroom.', caption: 'Hands-on, laptops open.' },
      { n: 4, alt: 'Rows of participants at their laptops during the workshop.', caption: 'A full room at work.' },
      { n: 5, alt: 'Two participants work through a step together on one laptop.', caption: 'Figuring it out together.' },
      {
        n: 6,
        alt: 'Members of the organising team stand together while one of them speaks to the room.',
        caption: 'The team, talking the room through it.',
      },
      {
        n: 7,
        alt: 'The organising team poses with the faculty and the speaker in the classroom.',
        caption: 'Everyone who made it happen.',
      },
      {
        n: 8,
        alt: 'Members of the organising team stand with the speaker in front of the classroom screen.',
        caption: 'The team with the speaker.',
      },
      {
        n: 9,
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

// Each album also has its own page, the way into it from its event.
export const albumPath = (album) => `/gallery/${album.slug}`
export const getAlbumBySlug = (slug) => albums.find((album) => album.slug === slug)
