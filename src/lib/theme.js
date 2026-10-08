import { useSyncExternalStore } from 'react'

// The dark theme, chosen per visitor and remembered on their device. The light theme is the default, whatever the
// device's own setting: it's declared "only light", so phone browsers in dark mode don't repaint it dark themselves.
//
// A saved choice is applied by the inline script in index.html before the first paint, so a dark-theme
// visitor never sees the light page flash first. That makes <html data-theme> the source of truth: React
// reads it here rather than keeping a copy that could disagree with what is on screen.
//
// The colours themselves are CSS variables (src/index.css), so switching recolours the whole site at once
// without re-rendering it.

// Also read by the inline script in index.html — rename both together.
const STORAGE_KEY = 'bic-theme'

// The browser chrome on phones follows the page background.
const THEME_COLOR = { light: '#EDE6D8', dark: '#14110E' }
// What the page tells the browser it supports (also set by the inline script in index.html).
const COLOR_SCHEME = { light: 'only light', dark: 'dark' }

const listeners = new Set()

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  document.head.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  document.head.querySelector('meta[name="color-scheme"]')?.setAttribute('content', COLOR_SCHEME[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage blocked (private browsing): the choice still holds until the tab is closed.
  }
  listeners.forEach((listener) => listener())
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light')
}
