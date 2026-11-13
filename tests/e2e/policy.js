// The preview server sends the live site's Content-Security-Policy (vite.config.js reads it from firebase.json).
// A browser reports whatever the policy blocks on the console, so collecting those messages turns "this script,
// style, font or request would be refused in production" into a failing test here.
//
// Call it before page.goto(); assert the returned list is empty once the page has done its work.
export function watchPolicy(page) {
  const blocked = []
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy')) blocked.push(message.text())
  })
  return blocked
}
