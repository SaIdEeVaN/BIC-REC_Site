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
- 🏆 **Achievements** — Club milestones and accomplishments
- 👥 **Meet us** — The club's three teams, each with its own page: board members, core members and associates (grouped by domain), every member with a profile page; the Associates page also leads to the recruitment results at [bicrec-results.web.app](https://bicrec-results.web.app)
- 🖼️ **Gallery** — Albums of the club's events, each with its own page and a full-screen viewer
- 🔧 **Projects** — Blockchain projects by the club
- 📚 **Resources** — Learning materials and links
- 📬 **Contact** — Contact form and club details
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
npm run build     # Build for production (outputs to /dist) + per-page share tags, sitemap.xml, robots.txt
npm run preview   # Preview the production build locally
npm run lint      # ESLint
npm run test:e2e  # Playwright: every page at five widths (360–1280px) — no sideways scroll, correct title + share tags
npm run og-image  # Re-render public/og-image.png from scripts/og-image.html
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

### Page titles & share previews

Titles and descriptions for every route live in [`src/seo.js`](src/seo.js). The app updates the tab title as you navigate, and `npm run build` writes a separate HTML file per route (e.g. `dist/events/2.html`) so link previews on WhatsApp, LinkedIn, etc. show the right page. Firebase serves those files via `cleanUrls` in `firebase.json`. The same route list is written out as `dist/sitemap.xml`, with a `dist/robots.txt` pointing crawlers at it. New events and members in `src/data/` are picked up by all three automatically.

---

## 📁 Project Structure

```
BIC-REC_Site/
├── .github/workflows/
│   └── firebase-deploy.yml       # Lint + e2e on every PR and push; deploys pushes to main
├── public/                       # favicon.svg, og-image.png
├── scripts/
│   ├── prerender-meta.js         # Post-build: per-route share tags, sitemap.xml, robots.txt
│   ├── og-image.html             # Source for public/og-image.png
│   └── render-og-image.js        # `npm run og-image`
├── src/
│   ├── assets/
│   │   ├── gallery/              # Album photos, one folder per album — see its README
│   │   ├── logo/
│   │   └── members/              # Member photos — drop in <slug>.jpg, see its README
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
│   │                             #   the club's email and social links
│   ├── lib/
│   │   ├── chain.js              # Block numbers, display hashes, sealed dates
│   │   ├── initials.js           # Initials for members without a photo
│   │   ├── memberPhotos.js       # Resolves a member's photo from their slug
│   │   ├── mesh.js               # Peer-mesh figures quoted on Home
│   │   └── theme.js              # Dark theme: the visitor's choice, saved on their device
│   ├── pages/                    # One component per route — the route table is in App.jsx
│   ├── App.jsx                   # Root component & routing
│   ├── main.jsx                  # App entry point
│   ├── seo.js                    # Title, description and canonical URL for every route
│   └── index.css                 # Global styles
├── tests/e2e/                    # Playwright specs
├── .firebaserc                   # Firebase project config
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
2. **Test** — the full Playwright suite, split across four runners
3. **Deploy** — on a push to `main`, or a manual run from the Actions tab: build, then publish to Firebase Hosting's live channel

A pull request runs lint and test as a check on the PR and never deploys. On `main`, a failure in either stops the deploy. A manual run deploys whichever branch it is started on, so start it on `main`.

> **Note:** Deploying requires a `FIREBASE_SERVICE_ACCOUNT` secret in the repository's GitHub Actions secrets.

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
