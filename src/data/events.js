import { parseLooseDate } from '../lib/chain.js'

// The club's real events, oldest first: each is a block on the chain, numbered by `id`. `album` is the event's
// album in data/gallery.js, when it has one: the event's page shows its photos and links to them in the gallery.
// `time`, `venue`, `highlights`, `speakers` and `certificate` are optional; leave out what isn't known.
export const events = [
  {
    id: 1,
    title: 'KBAIC Inauguration Ceremony',
    slug: 'kbaic-inauguration',
    date: 'September 18, 2025',
    venue: 'Rajalakshmi Engineering College',
    type: 'Inauguration',
    album: 'kbaic-inauguration-2025',
    description: 'Where it all started: the club, then the KBA Club REC, and its first board were inaugurated.',
    about: `Where it all started: the inauguration of the club, then the Kerala Blockchain Academy Club REC (KBA Club REC), and of its first board. It was held with the Department of Computer Science and Engineering under the theme “Unlocking the Future of Blockchain”.

The first board received their appointment letters and badges on the day. The club has since been renamed the Blockchain Innovation Club.`,
  },
  {
    id: 2,
    title: 'Decode Blockchain',
    slug: 'decode-blockchain',
    date: 'October 15, 2025',
    venue: 'Rajalakshmi Engineering College',
    type: 'Workshop',
    album: 'decode-blockchain-2025',
    description: 'The club’s first event: a hands-on blockchain workshop, “Unlocking the Future of Blockchain”.',
    about: `Decode Blockchain was the club’s first event: a hands-on workshop organised by the Blockchain Innovation Club with the Department of Computer Science and Engineering, under the theme “Unlocking the Future of Blockchain”.

Participants set up their wallets with the speaker and worked through it on their laptops, with the club’s team taking the room through each step.`,
  },
  {
    id: 3,
    title: 'European Immersion Program',
    slug: 'european-immersion-program',
    date: 'January 6, 2026',
    venue: 'Rajalakshmi Engineering College',
    type: 'Immersion Program',
    album: 'european-immersion-2026',
    description: 'Students from top European institutions came to REC for an immersion program in blockchain and quantum cryptography.',
    about: `Students from top European institutions came to Rajalakshmi Engineering College for an immersion program in blockchain and quantum cryptography.

They worked alongside the club’s members and faculty in the lab, with Blockverse on every screen, and the day ended with questions and answers and a group photo at the Idea Factory.`,
  },
  {
    id: 4,
    title: 'Home of Hope Visit',
    slug: 'home-of-hope-visit',
    date: 'January 26, 2026',
    venue: 'Home of Hope Children’s Home, near Porur',
    type: 'Outreach',
    album: 'home-of-hope-visit-2026',
    description: 'A visit to Home of Hope Children’s Home near Porur, home to 30 children and 7 staff.',
    about: `On 26 January 2026 the club visited Home of Hope Children’s Home near Porur, a unit of the Rose Bedeiah Foundation, where 30 children live with 7 staff.

The volunteers spent time with the children, starting with introductions in one big circle.`,
  },
  {
    id: 5,
    title: 'Byte the Dust: A Cyber Forensics',
    slug: 'byte-the-dust',
    date: 'February 12, 2026',
    type: 'Technical Event',
    description: 'A cyber forensics challenge: each team was handed a case and had to work out what happened.',
    about: `Byte the Dust was a cyber forensics challenge. Each team was given a case and had to apply the process of cyber and digital forensics to it: identify the evidence, preserve it, analyse it, and document what happened.

It was held on 12 February 2026, the day before Hack to Blockchain.`,
  },
  {
    id: 6,
    title: 'Hack to Blockchain',
    slug: 'hack-to-blockchain',
    date: 'February 13, 2026',
    venue: 'Rajalakshmi Engineering College',
    type: 'Technical Event',
    album: 'hack-to-blockchain-2026',
    description: 'The club’s event at Titanium 2026, with Notion: a session on blockchain consensus, then certificates and goodies.',
    about: `Hack to Blockchain was the club’s event at Titanium 2026, the national-level technical symposium at Rajalakshmi Engineering College, with Notion.

It opened with a session on consensus: thousands of computers keep the same ledger, so who decides which block is correct? The network has to agree without a leader. It closed with certificates and Notion goodies handed out on stage.`,
  },
  {
    id: 7,
    title: 'DeFi Unlocked',
    slug: 'defi-unlocked',
    date: 'April 11, 2026',
    venue: 'Rajalakshmi Engineering College',
    type: 'Workshop',
    album: 'defi-unlocked-2026',
    description: 'A hands-on workshop: a wallet, a transaction, a Solidity smart contract and a token of your own.',
    speakers: [{ name: 'Janakiraman K', role: 'Cryptocortex Crew' }],
    about: `DeFi Unlocked was a hands-on workshop in the lab, led by Janakiraman K of Cryptocortex Crew. Participants didn’t just learn about crypto, they built their own: they set up a wallet, made a transaction, wrote a Solidity smart contract in Remix and deployed it to the Sepolia testnet, and made a token of their own.

It closed with questions and answers, and pointers for carrying on: Remix, CryptoZombies, LearnWeb3, Sepolia Etherscan and Uniswap.`,
  },
]

export const getEventById = (id) => events.find(e => e.id === parseInt(id))
// The three most recent.
export const getFeaturedEvents = () => events.slice(-3)
// Status comes from the date, never a hand-typed field, so a past event can't keep saying "Upcoming".
// An event counts as upcoming until the end of its last day ("February 20–21, 2026" → end of the 21st).
function eventEnd(event) {
  const start = parseLooseDate(event.date)
  if (!start) return null
  const end = new Date(start)
  const range = event.date.match(/\b\d{1,2}\s*[–-]\s*(\d{1,2})\b/)
  if (range) end.setDate(Number(range[1]))
  end.setHours(23, 59, 59, 999)
  return end
}

export const isUpcoming = (event, now = new Date()) => {
  const end = eventEnd(event)
  return end !== null && end >= now
}

// Soonest first.
export const getUpcomingEvents = (now = new Date()) =>
  events.filter((e) => isUpcoming(e, now)).sort((a, b) => eventEnd(a) - eventEnd(b))
