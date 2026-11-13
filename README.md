# 🔗 BIC-REC — Blockchain Innovation Club Website

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**The official website for the Blockchain Innovation Club (BIC-REC)**

🌐 **Live Site:** [https://bicrec.web.app](https://bicrec.web.app)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## About

The BIC-REC website is the official online presence of the **Blockchain Innovation Club** at REC. It showcases the club's events, projects, achievements, team members, and resources.

The UI follows a **neo-brutalist design system** — hard geometry, 3px ink rules, hard offset shadows, and blockchain vocabulary (block numbers, hashes, sealed dates). The full spec lives in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

---

## ✨ Features

- 🏠 **Home** — Stacked hero, chain rail, stat bar and event ledger
- 📅 **Events** — The club's real events as a ledger, each with its own page and its gallery album
- ⛓️ **The chain** — Every event is a block with a real SHA-256 hash covering the block before it. `/chain` verifies it with the browser's own crypto and lets you break it by editing a record; `/mine` runs real proof of work (see [The chain](#the-chain))
- 🏆 **Achievements** — Club milestones and accomplishments
- 👥 **Meet us** — The club's three teams, each with its own page: board members, core members and associates (grouped by domain), every member with a profile page; the Associates page also leads to the recruitment results at [bicrec-results.web.app](https://bicrec-results.web.app)
- 🖼️ **Gallery** — Albums of the club's events, each with its own page and a full-screen viewer
- 🔧 **Projects** — Blockchain projects by the club
- 📚 **Resources** — Learning materials and links
- 📬 **Contact** — Contact form and club details (see [Contact form](#contact-form))
- 🌙 **Dark theme** — Opt-in from the header toggle, remembered per device (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#dark-theme))

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build tool & Dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling (tokens in `tailwind.config.js`) |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Motion](https://motion.dev/) | Animation (see [Motion](#motion)) |
| [Playwright](https://playwright.dev/) | End-to-end tests |
| Archivo + IBM Plex Mono | Typefaces (Google Fonts) |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | Deployment |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 (20.19+), 22 (22.13+) or 24+ — the ranges Vite 8 and ESLint 10 both support. CI uses 22.
- [npm](https://www.npmjs.com/) v9 or higher (ships with Node)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SaIdEeVaN/BIC-REC_Site.git
cd BIC-REC_Site

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The site will be available at **http://localhost:5173**

### Available Scripts

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production (outputs to /dist) + a file per page with its share tags, 404.html, sitemap.xml, robots.txt
npm run preview   # Preview the production build locally
npm run lint      # ESLint
npm run test:unit # Node's test runner: date parsing, the data files' integrity, the hosting config, SHA-256 and the chain
npm run test:e2e  # Playwright: every page at five widths (360–1280px) — no sideways scroll, correct title + share tags,
                  #   accessibility (axe, both themes), nothing the Content-Security-Policy blocks
npm run og-image  # Re-render public/og-image.png from scripts/og-image.html
npm run photos    # Make newly added member photos web-sized (WebP + a thumbnail for the roster cells)
```

> First time running the Playwright tests? Install the browser once: `npx playwright install chromium`

### Motion

Animation uses [Motion](https://motion.dev) (`motion/react`) through a small kit in [`src/components/motion/`](src/components/motion/). It follows the design system: blocks shunt, slam, draw and decrypt — nothing fades or blurs.

| Primitive | What it does |
|---|---|
| `SplitText` | Words/characters shunt up out of clipped slots (headings) |
| `Wipe` | Content "unseals" from under a solid block |
| `Slam` | A card drops from a long hard shadow onto its resting shadow |
| `Scramble` | Mono text decrypts through hex glyphs (hashes, block numbers) |
| `CountUp` / `Typewriter` | Number ticker / typed text with a hard block caret |
| `Magnetic` | Buttons lean toward the mouse pointer, reaching for it from `radius` away and easing off as it leaves |
| `ScrollProgress` / `RouteShutter` | Amber scroll bar in the header / ink shutter on page change |
| `Stamp` | Chips and statuses are stamped onto the page, oversized and askew |
| `LiftCell` | Grid cells are picked up onto a hard shadow on hover; with `shuffle`, filtered grids reflow cell by cell |
| `Marquee` | Huge caps band that runs sideways, speeds up as you scroll down and reverses when you scroll up |
| `Roll` | Button, nav and footer labels roll to a fresh copy on hover (CSS, `.roll` in `index.css`) |
| `Mine` | A hash churns through candidates until its difficulty zeros lock in — proof of work, drawn |
| `Desync` | A label forks into an amber and a mint copy on hover, then snaps back (CSS, `.desync`) |
| `Drift` | A block travels a little against the page as it scrolls past, so stacked blocks separate |

Two of the kit's drawings are the chain itself: `ChainRail` (blocks on one rail — keyed on a filter, it
redraws for whatever the selection left standing) and `Confirmations` (a cell per block sealed on top of
this one). `BlockClock` counts the club's block height
from its August 2025 genesis at one block every 12s — derived from the clock rather than stored, so it needs
nothing kept in sync.

Every `PageHeader` title and `EmptyState` heading forks on hover, so that accent is consistent across pages
without each one opting in.

Hover motion that needs no JavaScript lives in `src/index.css`: label roll, the ink sweep on linked ledger rows, the rising fill on ghost buttons and footer socials, the header logo lift and the form-field focus lift.

Anything that follows the pointer reads it from `motion/pointerField.js` — one window listener, coalesced
into a frame and shared by every tracker, so a tracker knows where the pointer is before it arrives and
stays true while the page scrolls under a pointer that hasn't moved. A tracker measures a box it isn't the
one moving (`Magnetic` translates an inner span), because measuring the element you are translating feeds
its own displacement into the next reading.

Everything respects the OS "reduce motion" setting (`MotionConfig reducedMotion="user"` plus `useCanAnimate()`), which renders the final state immediately. Scroll-triggered animations must observe an element that isn't clipped at rest — see `useReveal` in `core.js`.

### The chain

The site has always talked like a blockchain (blocks, hashes, sealed dates). For the events, it now is one.

- **Every event is a block** ([`src/lib/ledger.js`](src/lib/ledger.js)). A block's hash is the SHA-256 of its record: its height, the hash of the block before it, and the event's title, date, venue, type and summary, written out as plain text. That hash is what the ledger, the ticker and the event's page show.
- **Nothing is stored.** The chain is derived from `src/data/events.js`, so adding an event extends it and editing one changes every hash after it. The page says what that does and doesn't prove.
- **`/chain`** re-derives every hash with the browser's own SHA-256 (`crypto.subtle`) and holds it against the block's seal. Open a block, change its record, and that block and every block after it stop matching.
- **`/mine`** is proof of work, actually done: a Web Worker ([`src/lib/miner.worker.js`](src/lib/miner.worker.js)) tries nonce 0, 1, 2… until the block's hash starts with the zeros asked for. The search starts at 0, so the same name at the same difficulty always needs the same nonce. The mined block is not saved or sent anywhere.
- **The SHA-256 is the site's own** ([`src/lib/sha256.js`](src/lib/sha256.js)): a synchronous implementation, because the browser's is async-only and too slow per call to mine with. The unit tests hold it to Node's, byte for byte.

Other hashes on the site (a member's page, a drafted message) are still decorative: `shortHash` in `src/lib/chain.js`.

### Page titles & share previews

Titles and descriptions for every route live in [`src/seo.js`](src/seo.js). The app updates the tab title as you navigate, and `npm run build` writes a separate HTML file per route (e.g. `dist/events/2.html`) so link previews on WhatsApp, LinkedIn, etc. show the right page. Firebase serves those files via `cleanUrls` in `firebase.json`. The same route list is written out as `dist/sitemap.xml`, with a `dist/robots.txt` pointing crawlers at it. New events and members in `src/data/` are picked up by all three automatically.

The home page and each event's page also carry structured data (schema.org JSON-LD, `structuredDataFor` in `src/seo.js`): the club as an organisation, and the event with its date and venue. It is built from the same data the page shows.

### Hosting: 404s, redirects and security headers

All of this is in [`firebase.json`](firebase.json), with the files it relies on written by [`scripts/prerender-meta.js`](scripts/prerender-meta.js).

- **Every real page is a file.** There is no catch-all rewrite to `index.html`, so an address with no page gets `404.html` and a real 404 status. That page is still the app, so the visitor sees the site's own "Block not found". A new route must be added to `staticRoutes` in `src/seo.js` to get its file.
- **Old addresses.** `/join` and `/news` are redirected by Firebase. A core member's old `/team/board/<slug>` address is a file that loads the app, which sends the visitor on to `/team/core/<slug>`.
- **Security headers.** Every response carries a Content-Security-Policy and the usual hardening headers. `vite preview` sends the same ones, so the e2e suite runs under the live site's policy and fails if a page loads something it would block.
- **The inline script in `index.html`** (it applies a saved dark theme before first paint) is allowed by its hash in the policy. Edit that script and the build stops with the new hash to paste into `firebase.json`.
- **Loading anything from a new origin** (a font, a script, an API) means adding that origin to the policy in `firebase.json`.

### Contact form

The form at `/contact` has two ways of delivering a message, switched by `CONTACT_FORM_KEY` in [`src/data/club.js`](src/data/club.js):

- **No key (the default).** The site sends nothing itself: the form opens the visitor's own email app with the message written and addressed to the club. This only works on a device with an email app set up.
- **A key.** The form sends the message itself through [Web3Forms](https://web3forms.com), to the inbox the key was issued for, and offers the email app only if sending fails.

To switch it on, enter the club's email address at web3forms.com, copy the access key that arrives in that inbox, and set it as `CONTACT_FORM_KEY`. The key is not a secret (all it can do is send to that inbox), and the Content-Security-Policy already allows the service. The e2e tests follow the switch, and never contact the real service.

---

## 📁 Project Structure

```
BIC-REC_Site/
├── .github/
│   ├── dependabot.yml            # Weekly dependency update pull requests
│   └── workflows/
│       └── firebase-deploy.yml   # Lint + tests on every PR and push; deploys pushes to main
├── public/                       # favicon.svg, og-image.png
├── scripts/
│   ├── prerender-meta.js         # Post-build: a file per route with its share tags, 404.html, sitemap.xml, robots.txt
│   ├── og-image.html             # Source for public/og-image.png
│   ├── render-og-image.js        # `npm run og-image`
│   └── optimize-member-photos.js # `npm run photos`
├── src/
│   ├── assets/
│   │   ├── gallery/              # Album photos, one folder per album — see its README
│   │   ├── logo/
│   │   └── members/              # Member photos — drop in <slug>.jpg, then `npm run photos`; see its README
│   ├── components/
│   │   ├── kit/                  # Design-system primitives (Button, Chip, Ledger, TrackCards, ChainRail,
│   │   │                         #   Confirmations, BlockClock, ...)
│   │   ├── gallery/              # Album photo grid and full-screen viewer
│   │   ├── motion/               # Animation kit — see Motion above
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── EventRow.jsx
│   │   └── MemberCell.jsx
│   ├── data/                     # Events, gallery, members, associates, achievements, resources; club.js holds
│   │                             #   the club's email and social links, and the site's two switches
│   ├── lib/
│   │   ├── chain.js              # Block numbers, decorative display hashes, sealed dates
│   │   ├── ledger.js             # The real chain: one block per event, each hash covering the one before
│   │   ├── sha256.js             # SHA-256, synchronous: what seals the blocks and what the miner runs
│   │   ├── miner.worker.js       # The proof-of-work search behind /mine, on its own thread
│   │   ├── contact.js            # Sends the contact form's message, when the form has a key
│   │   ├── initials.js           # Initials for members without a photo
│   │   ├── memberPhotos.js       # Resolves a member's photo (and its thumbnail) from their slug
│   │   ├── mesh.js               # Peer-mesh figures quoted on Home
│   │   └── theme.js              # Dark theme: the visitor's choice, saved on their device
│   ├── pages/                    # One component per route — the route table is in App.jsx
│   ├── App.jsx                   # Root component & routing
│   ├── main.jsx                  # App entry point
│   ├── seo.js                    # Title, description and canonical URL for every route
│   └── index.css                 # Global styles
├── tests/
│   ├── e2e/                      # Playwright specs (pages, features, the chain, motion, theme, accessibility)
│   └── unit/                     # `node --test`: dates, data integrity, firebase.json, SHA-256, the chain
├── .firebaserc                   # Firebase project config
├── CLAUDE.md                     # Orientation for Claude Code sessions working on this repo
├── DESIGN_SYSTEM.md              # The design spec
├── firebase.json                 # Firebase hosting config
├── package.json
├── playwright.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🔥 Deployment

The site is hosted on **Firebase Hosting** at [https://bicrec.web.app](https://bicrec.web.app).

### Manual Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## ⚙️ CI/CD

[`.github/workflows/firebase-deploy.yml`](.github/workflows/firebase-deploy.yml) runs on every pull request to `main` and every push to it:

1. **Lint** — `npm run lint`
2. **Test** — the unit tests, then the full Playwright suite, split across four runners
3. **Deploy** — on a push to `main`, or a manual run from the Actions tab: build, then publish to Firebase Hosting's live channel

A pull request runs lint and test as a check on the PR and never deploys. On `main`, a failure in either stops the deploy. A manual run deploys whichever branch it is started on, so start it on `main`.

> **Note:** Deploying requires a `FIREBASE_SERVICE_ACCOUNT` secret in the repository's GitHub Actions secrets.

[Dependabot](.github/dependabot.yml) opens a pull request each Monday with that week's dependency updates, grouped. Each one runs the same lint and tests, and never deploys until it is merged.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

The code is released under the [MIT License](LICENSE).

That covers the code only. The photographs in `src/assets/members` and `src/assets/gallery` are of real people,
and they and the club's name and logo are not licensed for reuse.

---

<div align="center">

Made with ❤️ by the **Blockchain Innovation Club — REC**

</div>
