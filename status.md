# status.md — BIC/REC neo-brutalist redesign

Branch: `main` (redesign/neo-brutalist merged via PR #1 on 2026-09-14)
Spec: `bic_rec_design_system.md` (copied into repo as `DESIGN_SYSTEM.md`)
Started: 2026-09-14

## To-do

- [x] 1. Read design system spec + audit every page/component/data file
- [x] 2. Create branch `redesign/neo-brutalist`
- [x] 3. Foundation: tokens (tailwind.config), fonts (Archivo + IBM Plex Mono), global CSS, remove old CSS files
- [x] 4. Primitive kit (`src/components/kit`): Button, Chip, StatBar, ChainRail, Ticker, PageHeader, SectionHeading, Tabs, EmptyState, InkCTA, Ledger, TrackCards + `src/lib/chain.js`
- [x] 5. Shell: Navbar (ticker + active ink fill + mobile menu), Footer (ink section), App routing (no fades), favicon
- [x] 6. Home page
- [x] 7. About page
- [x] 8. Events + EventDetail pages
- [x] 9. Gallery page
- [x] 10. Board + Core members pages
- [x] 11. Projects page (builds list)
- [x] 12. Achievements page
- [x] 13. News + Resources pages
- [x] 14. Join Us + Contact pages (+ 404 page)
- [x] 15. Remove dead components + unused deps (framer-motion, gsap, aos, tsparticles, lightbox, lucide, react-icons, countup, type-animation, clsx), package-lock synced
- [x] 16. `npm run build` passes; visual check (headless Edge: Home/Events/Projects at 1280px, Home/EventDetail at 390px, Contact at 360px — no horizontal overflow)
- [x] 17a. Update README
- [x] 17b. Commit + push branch `redesign/neo-brutalist` to origin

---

# Task 2 — Technical polish (started 2026-09-14, same branch)

## To-do

- [x] 1. Per-page tab titles + descriptions at runtime (`src/seo.js` + `RouteEffects` in App)
- [x] 2. Share previews: build step writes one HTML file per route with its own share tags (`scripts/prerender-meta.js`, 18 routes), Firebase `cleanUrls` + `trailingSlash: false`
- [x] 3. Share image 1200×630 in the new style (`scripts/og-image.html` → `public/og-image.png`)
- [x] 4. Route-level code splitting — main bundle 252 KB → 212 KB, each page its own 0.3–7 KB chunk
- [x] 5. ESLint flat config (ESLint 10, react-hooks 7, react-refresh) + `npm run lint` passing. Fixed: `initials` moved to `src/lib/initials.js`; Navbar menu no longer calls setState in an effect
- [x] 6. Playwright test (`tests/e2e/pages.spec.js`): 75 passed. It caught a real bug — `/events/3` title ("CRYPTOCURRENCY") scrolled sideways on phones → headings now hyphenate/break long words
- [x] 7. Run everything (lint 0 errors, build, 75/75 e2e passed), README "Available scripts" + "Page titles & share previews" updated
  - Follow-up fix: event titles use `.t-title-fluid` on phones (34px @390, 32px @360, 76px desktop) so long words fit whole instead of breaking mid-word
  - Not verified locally: Firebase `cleanUrls` serving (no emulator) — check `/events/2` share preview after the next deploy
- [x] 8. Commit + push to `redesign/neo-brutalist`

---

# Task 3 — Motion "to the max" (started 2026-09-14, same branch `redesign/neo-brutalist`)

Rule: motion must obey DESIGN_SYSTEM.md — hard, mechanical, no blur/fade/rounded/gradient. Patterns from Kokonut UI / bklit UI are rebuilt in the brutalist style, not pasted in.

## To-do

- [x] 1. Research: `motion` 13.2 (React 18 OK). bklit UI = charts (visx + Motion springs, React 19/Tailwind 4 registry) → adapt one animated bar chart by hand. Kokonut UI = shadcn registry (Tailwind 4) → port patterns (typewriter, number ticker, magnetic button, marquee, decrypt text), don't install
- [x] 2. Installed `motion`; kit in `src/components/motion/`: SplitText, Wipe, Slam, Scramble, CountUp, Typewriter, Magnetic, ScrollProgress, RouteShutter + `core.js` (tokens, `useReveal`, `RevealContext`). `MotionConfig reducedMotion="user"` + `useCanAnimate()` render final state for reduced motion
- [x] 3. Home: orchestrated load (eyebrow types → words shunt up → lead unseals → buttons drop → next-event card slams → chain draws + packet travels), stat counters + amber fill, slamming track cards, printing ledger rows, magnetic CTAs
- [x] 4. Shell: ticker marquee, sliding ink nav fill (shared with Join), mobile menu slide-in, amber scroll-progress rule, ink route shutter
- [x] 5. Rolled out via kit to every page; Projects gets a bklit-style animated "What we build with" bar chart (hover readout + table view); Gallery crosses draw; Contact "Confirmed" stamp; member initials slam
- [x] 6. Lint 0 errors; Playwright 149 passed at 360/390/768/1024/1280 (layout tests under reduced motion + new motion-on tests + new "no heading word wider than its column" test). README "Motion" section added

## Bugs found and fixed along the way

- CountUp restarted forever (effect depended on a new array each render)
- Ledger rows never revealed: IntersectionObserver can't see an element hidden by its own clip-path → observe an unclipped wrapper, pass state down via `RevealContext`
- Scroll bar stuck full on lazy-loaded pages → progress computed from scrollY + current page height
- Headings force-broken mid-word (from Task 2's `overflow-wrap: anywhere`): ACHIEVEMENTS, VENKATARAMAN, DECENTRALIZE., RAMACHANDRAN, CRYPTOCURRENCY @768 → fluid type sizes, team grid max 4 columns, header aside column only when there is an aside
- Ledger 4-column layout squeezed the title to ~105px at 768 → switches at lg; event winners ledger overflowed at 1024 → switches at xl (`<Ledger from="xl">`)

## Notes

- Main bundle 212 KB → 360 KB (gzip 70 → 118 KB) because of `motion`. Could trim with `LazyMotion` later if needed.
- Chart deviates from the dataviz defaults on purpose: square bar ends and no hairline grid (DESIGN_SYSTEM.md forbids radius and 1px rules).
- [x] Committed + pushed to `redesign/neo-brutalist` (user asked: no new branches).

---

# Task 4 — Remove unnecessary / deprecated files (started 2026-09-14, branch `redesign/neo-brutalist`)

## To-do

- [x] 1. Audit tracked files: only `src/assets/logo/college.png` is unreferenced; dead exports `getCompletedEvents`, `eventTypes`, `eventTypeColors` (leftovers of the deleted Badge/EventCard UI); `<meta name="keywords">` ignored by search engines; local `dist/` + `test-results/` artifacts
- [x] 2. Dependencies: none of the 15 direct packages is deprecated, none unused. **Deploy workflow is the deprecated part:** `actions/checkout@v4` and `actions/setup-node@v4` run on Node 20, which GitHub removes from runners on 2026-09-23. (`FirebaseExtended/action-hosting-deploy@v0` is fine — the moving `v0` tag already points at the Node 24 build.)
- [x] 3. Removed `college.png`, the 3 dead exports, the keywords meta tag, local `dist/` + `test-results/`; workflow bumped to `checkout@v7` + `setup-node@v7` (both verified `runs.using: node24`, inputs unchanged)
- [x] 4. Lint 0 errors + 149 e2e passed (also on a clean `npm ci`); workflow drops the stale `--legacy-peer-deps` (clean install works without it); committed + pushed to `redesign/neo-brutalist`
  - Not verifiable locally: the workflow itself only runs on `main` — first real check is the next deploy after merging

---

# Task 5 — Delete unused / deprecated files on `main` (started 2026-09-14, after PR #1 merge)

## To-do

- [x] 1. Audit `main` with knip (unused files, exports, dependencies) + deprecation check: **0 unused files, 0 unused dependencies**, nothing deprecated left (Task 4 cleanup is on main). Only finding: 3 exports used solely inside their own file — `hashHex`, `parseLooseDate` (`src/lib/chain.js`), `SITE_URL` (`src/seo.js`)
- [x] 2. Un-exported those 3 (they stay as internal helpers)
- [x] 3. Lint 0 errors, knip clean (no unused files/exports/deps), 149 e2e passed
- [x] 4. User said continue → committed + pushed to `main` (no deploy: workflow is disabled on GitHub)
  - Still waiting on the user: re-enable the deploy workflow? delete merged `redesign/neo-brutalist`?

Notes:
- GitHub Actions: manual deploy run on `redesign/neo-brutalist` (2026-09-14 04:37 UTC) succeeded with `checkout@v7` / `setup-node@v7`, so the Node 24 workflow is proven.
- The "Deploy to Firebase Hosting" workflow is **disabled_manually** on GitHub — that's why the PR #1 merge (07:17 UTC) did not deploy. Pushes to `main` won't deploy until it's re-enabled.
- Branches: `origin/redesign/neo-brutalist` is fully merged into `main`; `origin/copilot/explain-repository-structure` is an unmerged, unrelated history from Aug 2026. Left untouched (branches, not files).

---

# Task 6 — Fix what visitors notice (started 2026-09-14, branch `main`)

## To-do

- [x] 1. Event status derived from the date (`isUpcoming` in `src/data/events.js`, end of last day, ranges handled) — replaces the hand-typed `status` field that kept April/May events "Upcoming". Home shows "Next event coming soon" when nothing is scheduled
- [x] 2. Contact form opens the visitor's email app addressed to the club (no backend), honest "Check your email app" state with a retry link; `?subject=` pre-fills the subject
- [x] 3. Join / Apply buttons → `/contact?subject=Membership application` (were `#`)
- [x] 4. Tests (`tests/e2e/features.spec.js`, clock pinned to 2026-04-01 / 2026-09-14): lint 0, knip clean, 154 e2e passed; screenshots checked (home "Next event coming soon" card at 1280/390, contact form + "Check your email app" state)
  - [x] User said yes → committed + pushed to `main` (deploy workflow still disabled, so no deploy)

## Open items for the club (not blocking)

- Join/Apply buttons open the contact form (subject "Membership application") — swap in a real application form link in `JoinUs.jsx` when one exists.
- Contact form sends through the visitor's email app (mailto). A real inbox/backend (e.g. Formspree, Supabase) would remove that step.
- Events: add new events to `src/data/events.js` — "Upcoming"/"Sealed" now updates by itself from the date.
- About page copy says "Founded in 2010" / "750+ students", which conflicts with other pages (2024, 500+). Copy kept as-is.
- Gallery needs real photos; swap `FrameMark` for `<img>` when they exist.
- Project GitHub/demo links and member LinkedIn links are all `'#'` in `src/data`, so they're hidden.

## Notes / decisions

- CI (`firebase-deploy.yml`) only deploys on push to `main`, so pushing this branch does NOT deploy.
- Palette/radius/border widths in `tailwind.config.js` are *replaced*, not extended — off-system colours won't compile.
- Archivo 400 is loaded for paragraph copy only; headings/UI stay at 700/800/900 as the spec says.
- `hero_bg.jpg` (glowing illustration) removed — spec forbids glow/illustration.
- Gallery: no real photos exist in the repo (old page used random picsum images) → frames are shown as reserved slots.
- Events "photo dump" viewer + lightbox removed (they only ever showed the same stock image).

---

# Task 7 — More motion (started 2026-09-15, branch `main`)

User asked for more animations. Everything already animated once on entrance; what was missing is motion that answers the visitor — hover, scroll speed, filter changes. Same rule as Task 3: obey DESIGN_SYSTEM.md (no fade/blur/radius/gradient).

## To-do

- [x] 1. New kit pieces: `Roll` (CSS label roll), `Stamp` (chips stamped on), `LiftCell` (cell picked up on hover + reshuffle on filter), `Marquee` (scroll-velocity kinetic band); `Slam hover`, `Scramble replay`
- [x] 2. Hover: buttons, desktop nav and footer links roll; track cards and member/role/gallery/contact cells lift (member cells and track cards also re-decrypt their block number); linked ledger rows sweep ink across the date cell; ghost buttons and footer socials fill from the bottom; header logo lifts; form fields lift on focus
- [x] 3. Scroll: Home hero lines drift apart; kinetic bands on Home / About / Join; footer head hash decrypts; header wordmark decrypts on load and on hover
- [x] 4. Filters: Gallery and Core members grids reshuffle (leavers shrink out, the rest slide to their new slots)
- [x] 5. Chips stamp on: Join skills, Projects stack + status, Event detail header; Contact "Drafted" stamp moved onto `Stamp`
- [x] 6. Lint 0 errors; build OK (main bundle 360 → 365 KB); full Playwright run 170 passed + 1 failed — the failure was my new band test (the band never holds still, so Playwright's wait-for-stable scroll timed out) → fixed, motion spec re-run 53 passed. README Motion table updated
  - Visual check with scripted Chromium against the dev server (Chrome extension wasn't connected): mid-animation screenshots at 1280 / 390, no console warnings, no sideways scroll; measured roll swap on hover + keyboard focus, 18/18 skill stamps hidden until scrolled to, reduced motion → stamps visible and untransformed, band static
  - Not committed — waiting on the user

## Notes

- Drift, bands and reshuffles all respect reduced motion (`useCanAnimate()` gates style-driven transforms, which `MotionConfig` alone doesn't stop).
- `Marquee` only runs its frame loop while in view. Tests must not use `scrollIntoViewIfNeeded` on the moving `.t-band` itself — scroll its parent strip.
- Gallery / Core members grids use `AnimatePresence mode="popLayout"`, so their direct children must forward refs (`LiftCell`, `MemberCell`).
- User said commit + push → committed as a12710a on `main`

---

# Task 8 — Board for the next tenure (started 2026-09-15, branch `main`)

Source: `bic-board-next-tenure.md` from the user (names and roles only — no departments, years, bios or links).

## To-do

- [x] 1. `src/data/members.js`: placeholder `boardMembers` replaced by `facultyCoordinators` (2) and `boardGroups` (9 groups, 26 people; a seat with two names becomes two cards)
- [x] 2. Board page: both coordinators in the ink panel; the board grouped under its published headings (Core board → Media) with seat counts; block numbers run on across groups
- [x] 3. `MemberCell`: department/year line only when present; `heading` prop so names sit under group headings
- [x] 4. Home "faculty coordinators" panel shows the new coordinators and links to the board (the old coordinator's email is gone)
- [x] 5. User sent the coordinators' emails mid-task → mailto links under each coordinator on the board page and on Home
- [x] 6. Lint 0 errors; full Playwright run caught a real bug — coordinator names (MUNEESHWARI) broke mid-word beside the initials block at 360 and 768 → initials stack above the name on phones, coordinators side by side only from xl. Re-run: 171 passed. Screenshots at 1280 / 390: 26 cards in 9 groups, no sideways scroll
- [x] 7. Committed + pushed to `main` (user asked)

## Open items for the club

- Departments, years, bios and LinkedIn links for the new board — add them per member in `src/data/members.js`.
- Core members page (`coreMembers`) still lists the old placeholder team; the tenure file didn't cover it.
- Name/email mismatch to confirm: "Dr. Muneeshwari R" (tenure file) vs `muneeshwari.p@rajalakshmi.edu.in` (user) — both kept as given.
