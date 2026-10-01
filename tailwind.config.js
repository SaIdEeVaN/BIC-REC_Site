/** @type {import('tailwindcss').Config} */
// Neo-brutalist tokens — see DESIGN_SYSTEM.md.
// Colors, radii and border widths are replaced (not extended) so off-system values can't creep in.
// Colors point at the CSS variables in src/index.css, which the dark theme redefines.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: 'var(--ink)',
      bone: 'var(--bone)',
      amber: 'var(--amber)',
      mint: 'var(--mint)',
      muted: 'var(--muted)',
      coal: 'var(--coal)',
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
        ink: '7px 7px 0 var(--ink)',
        'ink-6': '6px 6px 0 var(--ink)',
        'ink-5': '5px 5px 0 var(--ink)',
        amber: '7px 7px 0 var(--amber)',
        'amber-6': '6px 6px 0 var(--amber)',
        bone: '6px 6px 0 var(--bone)',
      },
    },
  },
  plugins: [],
}
