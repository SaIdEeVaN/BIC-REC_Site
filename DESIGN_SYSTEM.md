# BIC/REC — Neo-brutalist design system

Reference for the mockups in `BIC-REC Mockups.dc.html`. Everything here is what the screens actually use, not aspiration.

## Principle

Hard geometry, no softness. Nothing is rounded, nothing is blurred, nothing fades — see Motion. Structure is drawn with black rules instead of implied with whitespace. The blockchain idea is expressed literally — blocks, chains, hashes, sealed dates — never as gradients or glow.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#14110E` | All rules, all body text, inverted section backgrounds |
| Bone | `#EDE6D8` | Page/card background, text on ink |
| Canvas | `#f0eee9` | The board behind the mockup cards only |
| Amber | `#D9A441` | Primary action, one highlighted cell per group, "pending" status |
| Mint | `#2FD9C4` | Live/shipped signal only. Never on large areas |
| Muted ink | `#4A4238` | Metadata, past dates, hashes |

| Coal | `#14110E` | Text on amber and mint. Ink in the light theme; stays dark in the dark theme |

Two backgrounds per screen: bone and ink. Amber is an accent on small surfaces (buttons, one stat cell, one status pill). Mint appears at most twice per screen.

## Dark theme

Opt-in from the square, half-inked toggle in the header (the foot of the menu on phones below `sm`), and
remembered on the visitor's device. It is the same page printed in negative, not a second palette:

| Token | Dark value | Role |
| --- | --- | --- |
| `--bone` | `#14110E` | The page — ink becomes the paper |
| `--ink` | `#EDE6D8` | Rules, type and hard shadows — bone becomes the ink |
| `--muted` | `#B0A595` | Metadata, at the ~8:1 contrast muted has on bone |
| `.on-ink` | `#2A241D` | Ink sections keep their light-theme roles on charcoal, so they stay dark bands instead of turning into bright slabs |

Amber, mint and coal don't change. What that asks of new code:

- **Colour through the tokens.** Tailwind's `ink`/`bone`/`amber` and the `INK`/`AMBER` exports in
  `motion/core.js` are CSS variables, so they follow the theme without a re-render. A hex value won't.
- **Text on amber or mint is `text-coal`**, never `text-ink`, which turns light in the dark theme.
- **A dark strip that isn't a section still takes `.on-ink`** (the ticker, the kinetic band, the route shutter),
  or the dark theme inverts it into a light one.
- **SVG attributes can't hold `var()`.** Draw rules with `stroke="currentColor"` under a `text-ink`/`text-bone`
  class and fill with `fill-*` classes; animate something other than the colour (switch an amber rect on and
  off over the resting fill, say).

The one place mint is used at size is `<Desync>`, where it and amber are the two forked copies of a label. That is a hover state lasting 420ms, never a resting one, and at most one element per screen carries it.

## Type

- **Archivo** — headings and UI. Weights 700 / 800 / 900 only.
- **IBM Plex Mono** — metadata, labels, statuses, hashes, block numbers. Weights 400 / 500.

Scale as used:

| Role | Size / weight | Tracking |
| --- | --- | --- |
| Hero, desktop | 108px / 900, line-height 0.84 | `-.05em` |
| Hero, mobile | 46px / 900, line-height 0.88 | `-.045em` |
| Page title | 76px / 900 | `-.05em` |
| Section heading | 46px / 900 (mobile 32px) | `-.045em` |
| Inverted CTA heading | 60px / 900, line-height 0.9 | `-.045em` |
| Stat figure | 42px / 900 (mobile 30px) | `-.045em` |
| Card heading | 24px / 800 | `-.025em` |
| Body | 18px lead / 15px / 14.5px, line-height 1.55 | — |
| Nav, buttons | 13.5–16px / 700–800, uppercase | — |
| Mono meta | 11–13px / 400–500, lowercase | — |

Headlines are set in caps, tightly tracked, and allowed to run to `max-width: 13ch`–`17ch` so they break into stacked blocks. Mono labels stay lowercase; statuses stay uppercase.

## Rules and borders

- **3px solid ink** — every structural divider, card border, section boundary, input border.
- **2px solid ink** — chips and tags only.
- Grid gaps of `3px` on an ink background produce table rules — the grid shows through as the line.
- No border-radius anywhere. No `1px` borders except the outer mockup card frame.

## Shadows

Hard offset only, no blur, no alpha.

- `7px 7px 0 #14110E` — primary buttons, feature cards
- `6px 6px 0 #14110E` — track cards (mobile 5px)
- `7px 7px 0 #D9A441` / `6px 6px 0 #D9A441` — cards on ink backgrounds
- `6px 6px 0 #EDE6D8` — buttons inside ink sections

Offset direction is always down-right. Shadow color is ink on bone, amber or bone on ink.

## Layout

- Desktop card 1280px, mobile 390px, form panels 620px.
- Section padding `52–64px 44px` desktop, `30px 16px` mobile.
- Stat bars are 4 equal flex cells split by 3px rules, one cell filled amber.
- Tables are CSS grid, `150px 1fr 210px 160px`, gap 3px, ink background showing through.
- Builds list is `1fr 300px` rows separated by 3px rules — no cards.
- Track cards sit in a row joined by literal 36px × 3px connector bars: the chain, drawn.

## Blockchain vocabulary

- Header ticker: `block #0000 · 0x000…000 · sealed 00.00.00`, repeated and clipped.
- Cards carry `block #0001`, `block #0002`, `block #0003 · head` as their eyebrow.
- Every build row ends in a truncated hash `0x000…000` in muted mono.
- The chain rail SVG: one 3px horizontal line, 16px squares with 3px strokes at the nodes, two diagonal 3px branches per node. Amber square = head, bone squares = the rest.
- The confirmation strip: six equal cells split by 3px rules, one filled amber per block sealed on top, with
  an `00/06 confirmations` readout. A block nothing is built on yet reads `00/06` and stays bone.
- The block clock: `block 0000000 · sealed 00s ago`, counting from the club's genesis in August 2025 at one
  block every 12s. Derived from the clock, never stored, so it only ever goes up.
- SVG drawn at more than one size uses `vector-effect="non-scaling-stroke"`. A 3px rule in a `600`-unit
  viewBox is 1.6px once that viewBox is squeezed onto a phone, and the system has no rule below 2px.

## States

| State | Treatment |
| --- | --- |
| Pending | Amber cell, ink text, mono caps |
| Confirmed | Bone cell, ink text, mono caps |
| Archived | 2px ink outline chip, no fill |
| Shipped | Mint chip, ink text |
| Selected tab | Ink fill, bone text |
| Active nav item | Ink fill, bone text |
| Empty state | Full ink panel, amber shadow, 44px heading, one amber CTA |

## Motion

One reveal, one cadence. A block shunts up into place out of a 26px drop over 720ms on
`cubic-bezier(.34, 1.56, .64, 1)` — the overshoot is what makes it land rather than drift. Never opacity:
nothing on this site fades in.

| Layer | Treatment |
| --- | --- |
| Block entrance | `<Reveal>` / the `.reveal` class — the default for any block that scrolls in |
| Card entrance | `<Slam>` — hovers up-left on a long shadow, then drops onto its resting shadow |
| Table row | Clipped print, left to right, out of the ink |
| Type accent | `<SplitText>` on a heading, at most one per block |
| Value accent | `<Scramble>` / `<CountUp>` on mono figures and hashes |
| Status accent | `<Stamp>` — oversized and askew, then down onto the page |
| Mined value | `<Mine>` — a hash churns through candidates until its difficulty zeros lock in |
| Hover accent | `<Desync>` — the label forks into an amber and a mint copy, then snaps back |
| Depth | `<Drift>` — a block travels a little against the page as it scrolls past |
| Depth | `<Confirmations>` — cells fill left to right for each block sealed on top of this one |

Rules:

- **One block motion plus at most one accent.** A heading that rises, splits its title, decrypts its eyebrow
  and unseals its lead is four events where one was wanted.
- **Hover is a second layer, not a second accent.** A block may land on its entrance accent and still pick up,
  fork or re-decrypt under a pointer — a track card already does all three. What it may not do is arrive twice.
- **`<Mine>` is not another `<Scramble>`.** Scramble decrypts at a constant rate and you can read the answer
  coming; Mine *searches*, and nothing is settled until the difficulty is met. At most one per section, on the
  hash that is genuinely still being found — an unsealed block, a pending batch, the head of a feed — never on a
  sealed one. Everything already on the chain decrypts instead.
- **A filter change is an entrance.** `<ChainRail>` keyed on the active filter is rebuilt rather than patched,
  so the chain draws itself again for whatever the selection left standing. The ledger beneath it re-staggers
  on the same cadence — the two read as one event.
- **Every `<PageHeader>` title and `<EmptyState>` heading forks on hover.** It is set once in those two
  components, so pages do not opt in and cannot drift apart on it.
- **Loops earn their place.** Reveals fire once by design. The ticker, the kinetic band and the chain rail's
  packet are the only things that run forever, and each is describing something that is
  genuinely still happening.
- **Stagger is `Math.min(i, 12) * 45ms`** — `stagger(i)` in `motion/core.js`. Capped, because the 30th row
  of a ledger should not wait two seconds for its turn.
- **Reveals fire once**, at `threshold: 0.12` with `rootMargin: 0 0 -8% 0`, through the single shared
  observer in `motion/revealObserver.js`. Observing at the viewport edge animates blocks in the bottom
  sliver of the screen, where nobody sees them.
- **Reveals are CSS, not JS.** `translate` transitions on the compositor; springing dozens of block
  entrances through Motion is what made the long pages stutter.
- Mount sequences (hero, `PageHeader`) are the exception to the cadence — they are choreographed, and
  they are the only place delays run past 300ms.

## Don'ts

- No rounded corners, drop shadows with blur, gradients, or opacity-based greys.
- No icons drawn as illustration — geometry and rules do the work.
- No third background color. No second accent beyond amber + mint.
- No lowercase headlines, no body text below 13.5px, no rule thinner than 2px.
