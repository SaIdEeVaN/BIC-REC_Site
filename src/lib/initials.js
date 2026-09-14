// "Dr. Priya Venkataraman" -> "PV"
export const initials = (name) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
