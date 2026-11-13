import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
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
