# BIC/REC — Neo-brutalist design system

Reference for the mockups in `BIC-REC Mockups.dc.html`. Everything here is what the screens actually use, not aspiration.

## Principle

Hard geometry, no softness. Nothing is rounded, nothing is blurred, nothing fades. Structure is drawn with black rules instead of implied with whitespace. The blockchain idea is expressed literally — blocks, chains, hashes, sealed dates — never as gradients or glow.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#14110E` | All rules, all body text, inverted section backgrounds |
| Bone | `#EDE6D8` | Page/card background, text on ink |
| Canvas | `#f0eee9` | The board behind the mockup cards only |
| Amber | `#D9A441` | Primary action, one highlighted cell per group, "pending" status |
| Mint | `#2FD9C4` | Live/shipped signal only. Never on large areas |
| Muted ink | `#4A4238` | Metadata, past dates, hashes |

Two backgrounds per screen: bone and ink. Amber is an accent on small surfaces (buttons, one stat cell, one status pill). Mint appears at most twice per screen.

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

## Don'ts

- No rounded corners, drop shadows with blur, gradients, or opacity-based greys.
- No icons drawn as illustration — geometry and rules do the work.
- No third background color. No second accent beyond amber + mint.
- No lowercase headlines, no body text below 13.5px, no rule thinner than 2px.