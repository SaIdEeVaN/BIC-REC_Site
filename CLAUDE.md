# BIC-REC site

The public website of the Blockchain Innovation Club at Rajalakshmi Engineering College: a static React app
(Vite, Tailwind 3, React Router 7, Motion) on Firebase Hosting at https://bicrec.web.app. There is no backend.

**A push to `main` deploys to production.** Work on a branch; CI (lint, unit tests, e2e) gates the deploy.

## Commands

```bash
npm run dev         # dev server, http://localhost:5173
npm run lint        # ESLint
npm run test:unit   # node --test: dates, data, firebase.json, SHA-256 and the chain (about a second)
npm run test:e2e    # Playwright, against a production build served by `vite preview`
npm run build       # vite build, then scripts/prerender-meta.js
npm run photos      # make newly added member photos web-sized
npm run og-image    # re-render public/og-image.png
```

Run lint, the unit tests and the relevant e2e specs before pushing. The e2e suite builds the site itself.

## Where things are

- `src/data/` is the content. Adding an event, album, member or resource is an edit here and nothing else:
  routes, page titles, the sitemap, stats and the tests all derive from these files.
- `src/data/club.js` holds the club's contact details and the site's two switches (`RECRUITMENT_RESULTS_OPEN`,
  `CONTACT_FORM_KEY`).
- `src/seo.js` has every route's title and description, the list of routes that get a prerendered file
  (`staticRoutes`) and the structured data. It runs in the browser, at build time and in tests, so keep it free
  of browser-only and Vite-only code.
- `src/components/kit/` is the design system's primitives, `src/components/motion/` the animation kit. Read
  `DESIGN_SYSTEM.md` before designing anything: hard geometry, 3px rules, hard shadows; nothing fades or blurs.
- `firebase.json` is the hosting config, and `scripts/prerender-meta.js` writes the files it relies on.
- `src/lib/ledger.js` is the real chain: each event is a block whose SHA-256 hash covers the block before it.
  `/chain` verifies and tampers with it, `/mine` does proof of work in a worker. `src/lib/sha256.js` is the
  hash itself, held to Node's by the unit tests.

## Rules that are easy to break

- **Numbers are derived, never typed.** Member counts, event counts and an event's "Upcoming"/"Sealed" status
  come from the data and the date. Don't add a hand-maintained copy of something the data already says.
- **Every page is a file.** There is no catch-all rewrite, so a new route needs adding to `staticRoutes` or it is
  served with a 404 status.
- **The Content-Security-Policy is strict.** A new outside origin (font, script, API) has to be added to the
  policy in `firebase.json`. The inline script in `index.html` is allowed by hash: change it and the build
  stops and prints the new hash. No inline `<style>` or `style=""` in HTML.
- **The repo and the site are public.** No roll numbers, phone numbers or personal emails in data files.
  Members' college emails appear only on their own page, never in a list. Photos are published with all
  metadata stripped (`npm run photos` does this for member photos; see `src/assets/gallery/README.md`).
- **Don't invent content.** Events, achievements, figures and people come from the club. If something isn't
  known, leave the field out; the pages render what is present.
- **Everything animated respects reduced motion** and must leave the page in its final state without it.
- **An event's hash is real.** It comes from `blockOf(event).hash` in `lib/ledger.js`, never from `shortHash`
  (`lib/chain.js`), which is decoration for things that aren't blocks. Don't claim more than the chain proves:
  it is derived from the data at build time, and `/chain` says so.

## Conventions

- Comments explain why something is the way it is, usually by naming the problem it solved. Keep that up, and
  update a comment when the code under it changes.
- Tests are named as statements about the site ("an event without photos yet says so").
- Tests that depend on a switch in `club.js` follow the switch rather than pinning one state.
- Commit subjects are short and plain, often prefixed with the area ("Associates: …", "Events: …"), with the
  reasoning in the body.
- Styling is Tailwind utilities plus the component classes in `src/index.css`; colours are the tokens in
  `tailwind.config.js`, which the dark theme redefines.

## In a Claude Code cloud session

The pre-installed Chromium may not match the version this project's Playwright expects. Don't run
`playwright install`; launch with `executablePath: '/opt/pw-browsers/chromium'` from a local wrapper config
outside the repo instead.
