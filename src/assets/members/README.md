# Member photos

Drop a photo in here named after the member's `slug` in [`src/data/members.js`](../../data/members.js):

```
src/assets/members/arjun-k.jpg
src/assets/members/rakshitha-r.jpg
```

`.jpg`, `.jpeg`, `.png` and `.webp` all work. That is the whole step — the photo appears on the
member's cell on `/team/board` and on their own page at `/team/board/<slug>`, and the build hashes
and copies it automatically ([`src/lib/memberPhotos.js`](../../lib/memberPhotos.js)).

The faculty coordinators work the same way, by the `slug` on their entry in `facultyCoordinators`.
Theirs appears in the coordinators panel at the top of `/team/board`; they have no page of their own.

A member with no photo here keeps their initials block, so the roster can be filled in one face at a
time. Square images crop best — the cells and the detail panel are both squares, cropped from the
centre.
