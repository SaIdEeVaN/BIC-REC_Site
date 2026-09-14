# status.md — BIC/REC neo-brutalist redesign

Branch: `redesign/neo-brutalist`
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

## Open items for the club (not blocking)

- `JoinUs.jsx` → `APPLY_URL` is still `'#'` (both "Join"/"Apply" buttons go nowhere until a form link is added).
- Contact form doesn't send anything yet (same as before) — it only shows the "Message sent" state.
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
