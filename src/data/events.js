export const events = [
  {
    id: 1,
    title: 'Blockchain Fundamentals Workshop',
    slug: 'blockchain-fundamentals-workshop',
    date: 'January 15, 2026',
    time: '10:00 AM – 4:00 PM',
    venue: 'REC Seminar Hall, Block A',
    type: 'Workshop',
    status: 'completed',
    description: 'An intensive one-day workshop covering Bitcoin, Ethereum, distributed ledgers, and consensus mechanisms for absolute beginners.',
    about: `Our inaugural Blockchain Fundamentals Workshop brought together 60+ students from various departments at Rajalakshmi Engineering College for a full-day deep dive into blockchain technology. The session covered the history of distributed ledgers, how Bitcoin works under the hood, the Ethereum ecosystem, smart contracts, and hands-on demos with MetaMask wallets.

Participants received a beginner's toolkit including curated reading materials, a GitHub resource list, and access to the club's exclusive Discord server. The workshop was designed to be accessible to students from all backgrounds, including non-technical streams.

The event was a massive success with overwhelming positive feedback and a 95% satisfaction rate. It set the foundation for the Blockchain Innovation Club's journey at REC.`,
    poster: null,
    speakers: [
      { name: 'Dr. Rajesh Kumar Nair', role: 'Blockchain Researcher, Kerala Blockchain Association', bio: 'PhD in Distributed Systems with 10+ years in blockchain research and curriculum design.' },
      { name: 'Ms. Priya Menon', role: 'Web3 Developer, Technopark Trivandrum', bio: 'Full-stack Web3 developer specializing in DeFi protocols and smart contract auditing.' },
    ],
    highlights: [
      '60+ students attended from 8 departments',
      'Hands-on MetaMask wallet setup for every participant',
      'Live Bitcoin and Ethereum transaction demonstration',
      'Certificate of participation distributed to all attendees',
      'Q&A session with industry experts',
      'Beginner resource toolkit provided',
    ],
    registrationLink: '#',
    photos: [],
    certificate: true,
  },
  {
    id: 2,
    title: 'Web3 Hackathon 2026',
    slug: 'web3-hackathon-2026',
    date: 'February 20–21, 2026',
    time: '9:00 AM – 6:00 PM (24 Hours)',
    venue: 'REC Innovation Lab & Main Auditorium',
    type: 'Hackathon',
    status: 'completed',
    description: 'A 24-hour hackathon challenging student teams to build decentralized applications solving real-world problems using blockchain technology.',
    about: `The Web3 Hackathon 2026 was our flagship event — an intense 24-hour challenge that brought together 12 teams and 60+ participants to build decentralized solutions for real-world problems. Teams worked on projects spanning DeFi, supply chain transparency, digital identity verification, healthcare records, and NFT marketplaces.

Industry mentors from Kerala Blockchain Association and leading Web3 companies guided teams throughout the marathon event, providing technical support and business insights. The energy was electric as teams worked through the night to bring their ideas to life.

All 12 teams successfully demonstrated working prototypes. The top 3 teams won cash prizes worth ₹50,000 combined and were recommended for incubation support at the KBA innovation hub.`,
    poster: null,
    speakers: [
      { name: 'Mr. Arun Sharma', role: 'CTO, BlockTech India', bio: 'Leading blockchain architect with expertise in DeFi protocols and Layer 2 solutions.' },
      { name: 'Ms. Deepa Krishnan', role: 'Product Lead, Web3 Foundation', bio: 'Product strategist driving adoption of decentralized technologies across Southeast Asia.' },
    ],
    highlights: [
      '12 teams, 60+ participants over 24 hours',
      '5 live DApp demonstrations at the finale',
      'Cash prizes worth ₹50,000 distributed',
      'Expert mentorship from KBA professionals',
      'Top 3 projects recommended for incubation',
      'All participants received completion certificates',
    ],
    registrationLink: '#',
    photos: [],
    winners: [
      { position: '🥇 1st Place', team: 'ChainShield', project: 'DeCert — Blockchain Certificate Verification', prize: '₹25,000' },
      { position: '🥈 2nd Place', team: 'Web3Warriors', project: 'CryptoVote — Decentralized Voting Platform', prize: '₹15,000' },
      { position: '🥉 3rd Place', team: 'BlockBuilders', project: 'TrustChain Supply — Supply Chain Transparency', prize: '₹10,000' },
    ],
    certificate: true,
  },
  {
    id: 3,
    title: 'DeFi & Cryptocurrency Guest Lecture',
    slug: 'defi-guest-lecture',
    date: 'March 10, 2026',
    time: '2:00 PM – 5:00 PM',
    venue: 'REC Main Auditorium',
    type: 'Guest Lecture',
    status: 'completed',
    description: 'An expert session on Decentralized Finance, yield farming, liquidity pools, and the future of money by a leading DeFi researcher.',
    about: `A captivating session on the rapidly evolving DeFi landscape, delivered by Mr. Vivek Nair, a renowned DeFi researcher and protocol designer. The lecture provided an in-depth exploration of how decentralized finance is fundamentally reimagining the global financial system.

Topics covered included automated market makers (AMMs), yield farming strategies, liquidity pools, staking mechanisms, governance tokens, and the risks involved in DeFi participation. Real-world protocol walkthroughs on Uniswap, Aave, and Compound made abstract concepts tangible.

The lecture drew attendees not just from REC but also from nearby colleges, making it one of the most well-attended events in the club's history with 100+ participants.`,
    poster: null,
    speakers: [
      { name: 'Mr. Vivek Nair', role: 'DeFi Researcher & Protocol Designer, KBA', bio: 'Expert in decentralized finance with contributions to multiple DeFi protocols and author of the "DeFi Decoded" whitepaper.' },
    ],
    highlights: [
      '100+ attendees from multiple colleges',
      'Live DeFi protocol demonstration on mainnet',
      'Interactive Q&A covering advanced DeFi concepts',
      'Digital resource kit with curated DeFi learning path',
      'Networking session with industry professional',
    ],
    registrationLink: '#',
    photos: [],
    certificate: false,
  },
  {
    id: 4,
    title: 'Smart Contract Development Bootcamp',
    slug: 'smart-contract-bootcamp',
    date: 'April 5, 2026',
    time: '10:00 AM – 5:00 PM',
    venue: 'REC Computer Lab, Block B (Room 205)',
    type: 'Workshop',
    status: 'upcoming',
    description: 'A full-day hands-on bootcamp on Solidity programming, smart contract deployment on Ethereum, and building your first DApp.',
    about: `The Smart Contract Development Bootcamp is designed for students who want to transition from blockchain enthusiasts to blockchain builders. This intensive full-day hands-on session covers everything you need to write, test, and deploy smart contracts on the Ethereum blockchain.

You will learn Solidity programming from scratch, understand smart contract security vulnerabilities, use professional tools like Remix IDE and Hardhat, and deploy your first smart contract on the Ethereum Sepolia testnet. By end of day, every participant will have built and deployed a working DApp.

Prerequisites: Basic JavaScript or programming knowledge. Bring your laptop with MetaMask installed (we'll help set it up).`,
    poster: null,
    speakers: [
      { name: 'Mr. Rohith Menon', role: 'Senior Solidity Developer, Polygon', bio: 'Experienced smart contract developer with 5+ years in Ethereum development and 3 deployed DeFi protocols.' },
    ],
    highlights: [
      'Write and understand Solidity syntax from scratch',
      'Deploy your first smart contract on Ethereum Sepolia testnet',
      'Build a simple DApp frontend with React and ethers.js',
      'Smart contract security best practices',
      'Take-home project to continue building',
    ],
    registrationLink: 'https://forms.google.com',
    photos: [],
    certificate: true,
  },
  {
    id: 5,
    title: 'Crypto Quiz Championship',
    slug: 'crypto-quiz',
    date: 'April 25, 2026',
    time: '3:00 PM – 6:00 PM',
    venue: 'REC Seminar Hall, Block C',
    type: 'Competition',
    status: 'upcoming',
    description: 'A competitive team quiz on Blockchain, Cryptocurrency, Web3, and emerging technologies with exciting cash prizes and certificates.',
    about: `Test your blockchain knowledge in our Crypto Quiz Championship! Teams of 2–3 will battle it out across 5 electrifying rounds covering Blockchain basics, Cryptocurrency markets, DeFi protocols, NFTs, and cutting-edge Web3 trends.

The event features a rapid-fire round, a visual round with crypto chart analysis, and a technical round with smart contract code snippets. There will be general awareness questions too, so teams with mixed backgrounds are welcome!

Exciting cash prizes for the top 3 teams, special recognition for the best individual performer, and certificates for all participants.`,
    poster: null,
    speakers: [],
    highlights: [
      '5 rounds of increasing difficulty',
      'Teams of 2–3 members',
      'Cash prizes for top 3 teams',
      'Special prize for best individual performer',
      'Open to all REC students (all years & departments)',
      'Certificates for all participants',
    ],
    registrationLink: 'https://forms.google.com',
    photos: [],
    certificate: true,
  },
  {
    id: 6,
    title: 'Community Blockchain Meetup',
    slug: 'community-meetup',
    date: 'May 10, 2026',
    time: '5:00 PM – 8:00 PM',
    venue: 'REC Open Amphitheater',
    type: 'Community Meetup',
    status: 'upcoming',
    description: 'An informal evening gathering for blockchain enthusiasts to connect, showcase projects, share ideas, and discuss the latest in Web3.',
    about: `Join us for a relaxed and inspiring evening meetup where blockchain enthusiasts from REC and the broader tech community come together under the open sky. This informal gathering is all about community, connection, and sharing ideas.

The evening features 5-minute lightning talks by club members, project demonstrations, open floor discussions on trending Web3 topics, and unstructured networking time. Whether you're a beginner or an expert, this is the perfect space to share what you've been learning and building.

Refreshments will be provided. This event is free and open to all REC students.`,
    poster: null,
    speakers: [],
    highlights: [
      'Lightning talks by club members (5 min each)',
      'Project showcase and live demos',
      'Open discussion on latest Web3 trends',
      'Free and open to all REC students',
      'Refreshments provided',
      'Relaxed networking and community building',
    ],
    registrationLink: '#',
    photos: [],
    certificate: false,
  },
]

export const getEventById = (id) => events.find(e => e.id === parseInt(id))
export const getFeaturedEvents = () => events.slice(0, 3)
export const getUpcomingEvents = () => events.filter(e => e.status === 'upcoming')
