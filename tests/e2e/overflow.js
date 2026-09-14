// Measures sideways page scroll and lists the widest offending elements for the failure message.
export function measureOverflow(page) {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth
    const offenders = []
    for (const el of document.body.querySelectorAll('*')) {
      const rect = el.getBoundingClientRect()
      // scrollWidth also catches text spilling out of a normally sized box (long unbreakable words) —
      // but not for an element that clips its own overflow (e.g. the ticker), whose scrollWidth is contained.
      const clipsItself = getComputedStyle(el).overflowX !== 'visible'
      const right = clipsItself ? rect.right : Math.max(rect.right, rect.left + el.scrollWidth)
      if (rect.width === 0 || right <= viewport + 1) continue
      // Content inside an overflow-clipping ancestor (e.g. the header ticker) can't cause page scroll.
      let clipped = false
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== 'visible') {
          clipped = true
          break
        }
      }
      if (!clipped) {
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 4).join('.') : ''
        offenders.push(`<${el.tagName.toLowerCase()}${cls ? ` .${cls}` : ''}> right edge ${Math.round(right)}px`)
      }
    }
    return { viewport, scrollWidth: document.documentElement.scrollWidth, offenders: offenders.slice(0, 5) }
  })
}

// Headings break long words only as a last resort (overflow-wrap: anywhere), which reads as broken type
// ("ACHIEVEMENT/S"). List every heading word wider than its column so the type scale can be fixed instead.
export function findOversizedHeadingWords(page) {
  return page.evaluate(() => {
    const out = []
    const probe = document.createElement('span')
    document.body.appendChild(probe)
    for (const el of document.querySelectorAll('.t-hero, .t-title, .t-h2, .t-h3, .t-cta, .t-empty, .t-card, .t-row')) {
      const style = getComputedStyle(el)
      if (style.display === 'inline' || el.clientWidth === 0) continue
      const available = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${style.font};letter-spacing:${style.letterSpacing};text-transform:${style.textTransform}`
      // innerText keeps the line breaks between block children (e.g. the three hero lines).
      for (const word of el.innerText.split(/\s+/).filter(Boolean)) {
        probe.textContent = word
        const width = probe.getBoundingClientRect().width
        if (width > available + 0.5) out.push(`"${word}" is ${width.toFixed(1)}px in a ${available.toFixed(1)}px column`)
      }
    }
    probe.remove()
    return out
  })
}

export function overflowMessage(route, result) {
  return `${route} scrolls sideways (${result.scrollWidth}px > ${result.viewport}px). Widest elements:\n${result.offenders.join('\n')}`
}
