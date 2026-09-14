// Blockchain vocabulary helpers: stable pseudo-hashes, block numbers and "sealed" dates.
// Purely presentational — nothing here is cryptographic.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// FNV-1a, re-seeded per 8-hex chunk, so the same input always yields the same hash.
export function hashHex(input, length = 40) {
  const str = String(input)
  let out = ''
  let seed = 0
  while (out.length < length) {
    let h = 0x811c9dc5 ^ seed
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 0x01000193)
    }
    out += (h >>> 0).toString(16).padStart(8, '0')
    seed++
  }
  return out.slice(0, length)
}

export const shortHash = (input) => {
  const h = hashHex(input)
  return `0x${h.slice(0, 3)}…${h.slice(-3)}`
}

export const pad2 = (n) => String(n).padStart(2, '0')

export const blockNo = (n) => `block #${String(n).padStart(4, '0')}`

// Parses the loose date strings in src/data ("January 15, 2026", "February 20–21, 2026", "Nov 2024").
export function parseLooseDate(value) {
  if (value instanceof Date) return value
  const str = String(value).toLowerCase()
  const year = str.match(/\b(\d{4})\b/)
  if (!year) return null
  const month = MONTHS.findIndex((m) => str.includes(m))
  const day = str.replace(year[0], '').match(/\b(\d{1,2})\b/)
  return new Date(Number(year[1]), Math.max(month, 0), day ? Number(day[1]) : 1)
}

export function sealedDate(value) {
  const d = parseLooseDate(value)
  if (!d) return '00.00.00'
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${pad2(d.getFullYear() % 100)}`
}

export const isRealLink = (href) => Boolean(href) && href !== '#'

export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Drops leading emoji/symbols ("🏆 1st Place" -> "1st Place"); the system uses no pictograms.
export const stripEmoji = (text) => text.replace(/^[^\p{L}\p{N}]+/u, '').trim()
