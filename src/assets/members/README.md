# Member photos

Drop a photo in here named after the member's `slug` in [`src/data/members.js`](../../data/members.js):

```
src/assets/members/arjun-k.jpg
src/assets/members/rakshitha-r.jpg
```

`.jpg`, `.jpeg`, `.png` and `.webp` all work. Then run:

```bash
npm run photos
```

That turns each dropped-in photo into the two files that are committed, and removes the original:

- `<slug>.webp`: the member's own page, at most 800px on its shorter side.
- `<slug>-thumb.webp`: the roster cells, a 192px square cropped from the centre.

Both are re-encoded from the pixels alone, so no metadata (EXIF, GPS, camera details) is published with
them. Photos that already have their pair are left alone, so it is safe to run at any time. To replace a
photo, drop the new one in beside the old pair and run it again.

The photo appears on the member's cell on their team's page (`/team/board`, `/team/core` or
`/team/associates`) and on their own page, and the build hashes and copies it automatically
([`src/lib/memberPhotos.js`](../../lib/memberPhotos.js)). A photo that hasn't been through `npm run photos`
yet still shows — the cells just load the full-size file until it has.

The faculty coordinators work the same way, by the `slug` on their entry in `facultyCoordinators`.
Theirs appears in the coordinators panel at the top of `/team/board`; they have no page of their own.

A member with no photo here keeps their initials block, so the roster can be filled in one face at a
time. Square images crop best — the cells and the detail panel are both squares, cropped from the
centre.
