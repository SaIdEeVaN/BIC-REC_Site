// Every link here is someone else's page, and they move: checked on 13 Nov 2026, when two had gone 404 (MDN's Web3
// glossary entry, ethereum.org's old research page) and two pointed at projects that had ended (web3.js, sunset in
// March 2025, and Buildspace). Re-check them when adding to the list.
export const resources = {
  'Blockchain Basics': [
    { title: 'Bitcoin Whitepaper', type: 'PDF', url: 'https://bitcoin.org/bitcoin.pdf', description: 'The original Bitcoin whitepaper by Satoshi Nakamoto — the document that started it all.' },
    { title: 'Ethereum Whitepaper', type: 'PDF', url: 'https://ethereum.org/whitepaper/', description: 'Vitalik Buterin\'s original Ethereum proposal introducing programmable smart contracts.' },
    { title: 'Blockchain Basics — Coursera', type: 'Course', url: 'https://www.coursera.org/learn/blockchain-basics', description: 'Beginner-friendly introduction to blockchain technology by University at Buffalo.' },
    { title: 'How Does Bitcoin Work?', type: 'Video', url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4', description: '3Blue1Brown\'s visual, intuitive explanation of how Bitcoin and cryptographic hashing work.' },
    { title: 'What is Web3?', type: 'Docs', url: 'https://ethereum.org/web3/', description: 'ethereum.org\'s introduction to Web3 — what it is, how it differs from Web2, and why it matters.' },
  ],
  'Development': [
    { title: 'Solidity Documentation', type: 'Docs', url: 'https://docs.soliditylang.org', description: 'Official Solidity language documentation — the go-to reference for smart contract development.' },
    { title: 'CryptoZombies', type: 'Interactive', url: 'https://cryptozombies.io', description: 'Learn Solidity by building a zombie game — the most fun way to learn smart contracts.' },
    { title: 'Hardhat Documentation', type: 'Docs', url: 'https://hardhat.org/docs', description: 'Professional Ethereum development environment for compiling, testing, and deploying contracts.' },
    { title: 'Remix IDE', type: 'Tool', url: 'https://remix.ethereum.org', description: 'Browser-based Solidity IDE — perfect for learning and deploying smart contracts quickly.' },
    { title: 'Alchemy Web3 University', type: 'Course', url: 'https://www.alchemy.com/university', description: 'Free web3 development bootcamp covering Solidity, Hardhat, and full DApp development.' },
  ],
  'Web3': [
    { title: 'ethers.js Documentation', type: 'Docs', url: 'https://docs.ethers.org', description: 'Lightweight JavaScript library for interacting with Ethereum and EVM-compatible chains.' },
    { title: 'viem Documentation', type: 'Docs', url: 'https://viem.sh', description: 'Type-safe TypeScript interface for Ethereum — composable modules for reading chains, sending transactions, and calling contracts.' },
    { title: 'MetaMask Learn', type: 'Tutorial', url: 'https://learn.metamask.io', description: 'MetaMask\'s official learning platform covering wallets, DeFi basics, and Web3 concepts.' },
    { title: 'IPFS Documentation', type: 'Docs', url: 'https://docs.ipfs.tech', description: 'InterPlanetary File System — decentralized storage backbone for Web3 applications.' },
    { title: 'OpenZeppelin Contracts', type: 'Library', url: 'https://docs.openzeppelin.com/contracts', description: 'Secure, audited smart contract library — the industry standard for safe Solidity development.' },
  ],
  'Learning': [
    { title: 'Patrick Collins — Full Stack Web3', type: 'Video', url: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ', description: '32-hour comprehensive course on blockchain development by one of the best Web3 educators on YouTube.' },
    { title: 'Speedrun Ethereum', type: 'Project', url: 'https://speedrunethereum.com', description: 'Learn Solidity by building — hands-on challenges that take you from a first NFT to a DEX, step by step.' },
    { title: 'Ethereum Research', type: 'Research', url: 'https://ethereum.org/community/research/', description: 'The open areas of Ethereum research — consensus, scaling, cryptography and more — and how to get involved.' },
    { title: 'Web3 Career Roadmap', type: 'Guide', url: 'https://roadmap.sh/blockchain', description: 'Comprehensive visual roadmap for becoming a blockchain developer — from beginner to advanced.' },
    { title: 'Blockchain Council Courses', type: 'Course', url: 'https://www.blockchain-council.org', description: 'Professional blockchain certification courses covering various specializations and career paths.' },
  ],
}
