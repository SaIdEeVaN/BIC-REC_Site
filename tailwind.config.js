/** @type {import('tailwindcss').Config} */
// Neo-brutalist tokens — see DESIGN_SYSTEM.md.
// Colors, radii and border widths are replaced (not extended) so off-system values can't creep in.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#14110E',
      bone: '#EDE6D8',
      amber: '#D9A441',
      mint: '#2FD9C4',
      muted: '#4A4238',
    },
    borderRadius: {
      none: '0',
    },
    borderWidth: {
      DEFAULT: '3px',
      0: '0',
      2: '2px',
      3: '3px',
    },
    extend: {
      fontFamily: {
        sans: ['Archivo', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        ink: '7px 7px 0 #14110E',
        'ink-6': '6px 6px 0 #14110E',
        'ink-5': '5px 5px 0 #14110E',
        amber: '7px 7px 0 #D9A441',
        'amber-6': '6px 6px 0 #D9A441',
        bone: '6px 6px 0 #EDE6D8',
      },
    },
  },
  plugins: [],
}
