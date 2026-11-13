import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The headers Firebase sends with every response (firebase.json), sent by `vite preview` as well. The e2e suite
// runs against the preview server, so it runs under the same Content-Security-Policy as the live site: a script,
// font or request the policy would block in production is blocked in the tests first. The dev server is left
// alone — hot reload needs things the policy rightly forbids.
const { hosting } = JSON.parse(readFileSync(new URL('./firebase.json', import.meta.url), 'utf8'))
const everywhere = hosting.headers.find((rule) => rule.source === '**').headers

export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    headers: Object.fromEntries(everywhere.map(({ key, value }) => [key, value])),
  },
  build: {
    rolldownOptions: {
      output: {
        // The libraries get chunks of their own. They are about 85% of what the first page downloads (React and
        // React Router, and Motion) and they change a few times a year, but they used to share one file with the
        // site's own code and data — so adding an event or a member gave that whole file a new name, and every
        // returning visitor downloaded React again. Now a content change renames only the small chunk it is in.
        codeSplitting: {
          groups: [
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/, priority: 2 },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})
