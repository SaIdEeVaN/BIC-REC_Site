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

---

## About

The BIC-REC website is the official online presence of the **Blockchain Innovation Club** at REC. It showcases the club's events, projects, achievements, team members, and resources.

The UI follows a **neo-brutalist design system** — hard geometry, 3px ink rules, hard offset shadows, and blockchain vocabulary (block numbers, hashes, sealed dates). The full spec lives in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

---

## ✨ Features

- 🏠 **Home** — Stacked hero, chain rail, stat bar and event ledger
- 📅 **Events** — Filterable event ledger with detail pages
- 🏆 **Achievements** — Club milestones and accomplishments
- 👥 **Team** — Board members and core team profiles
- 🖼️ **Gallery** — Photo frames by category
- 📰 **News** — Latest club updates
- 🔧 **Projects** — Blockchain projects by the club
- 📚 **Resources** — Learning materials and links
- 🤝 **Join Us** — Membership and application info
- 📬 **Contact** — Contact form and club details

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build tool & Dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling (tokens in `tailwind.config.js`) |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| Archivo + IBM Plex Mono | Typefaces (Google Fonts) |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | Deployment |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

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
npm run build     # Build for production (outputs to /dist) + write per-page share tags
npm run preview   # Preview the production build locally
npm run lint      # ESLint
npm run test:e2e  # Playwright: every page at 360/390/1280px — no sideways scroll, correct title + share tags
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
| `Magnetic` | Buttons lean toward the mouse pointer |
| `ScrollProgress` / `RouteShutter` | Amber scroll bar in the header / ink shutter on page change |

Everything respects the OS "reduce motion" setting (`MotionConfig reducedMotion="user"` plus `useCanAnimate()`), which renders the final state immediately. Scroll-triggered animations must observe an element that isn't clipped at rest — see `useReveal` in `core.js`.

### Page titles & share previews

Titles and descriptions for every route live in [`src/seo.js`](src/seo.js). The app updates the tab title as you navigate, and `npm run build` writes a separate HTML file per route (e.g. `dist/events/2.html`) so link previews on WhatsApp, LinkedIn, etc. show the right page. Firebase serves those files via `cleanUrls` in `firebase.json`. New events in `src/data/events.js` are picked up automatically.

---

## 📁 Project Structure

```
BIC-WEBSITE/
├── .github/
│   └── workflows/
│       └── firebase-deploy.yml   # CI/CD auto-deploy workflow
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Images and media
│   ├── components/
│   │   ├── kit/                  # Design-system primitives (Button, Chip, Ledger, TrackCards, ChainRail, ...)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── EventRow.jsx
│   │   └── MemberCell.jsx
│   ├── lib/chain.js              # Block numbers, display hashes, sealed dates
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── EventDetail.jsx
│   │   ├── About.jsx
│   │   ├── Achievements.jsx
│   │   ├── BoardMembers.jsx
│   │   ├── CoreMembers.jsx
│   │   ├── Gallery.jsx
│   │   ├── Projects.jsx
│   │   ├── Resources.jsx
│   │   ├── News.jsx
│   │   ├── JoinUs.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── data/                     # Static data files
│   ├── App.jsx                   # Root component & routing
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── .firebaserc                   # Firebase project config
├── firebase.json                 # Firebase hosting config
├── tailwind.config.js
├── vite.config.js
└── package.json
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

This project uses **GitHub Actions** for automatic deployments. Every push to the `main` branch triggers:

1. ✅ Install dependencies (`npm ci`)
2. ✅ Build the project (`npm run build`)
3. ✅ Deploy to Firebase Hosting

The workflow is defined in [`.github/workflows/firebase-deploy.yml`](.github/workflows/firebase-deploy.yml).

> **Note:** Requires a `FIREBASE_SERVICE_ACCOUNT` secret to be set in the repository's GitHub Actions secrets.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by the **Blockchain Innovation Club — REC**

</div>
