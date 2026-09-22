// One pointer position, read once a frame and shared by everything that tracks it.
//
// A tracker that listens on its own element only learns where the pointer is once the pointer is already
// on top of it, and never hears about the page scrolling out from under a pointer that hasn't moved. One
// window listener feeds all of them instead: readers are handed the pointer's viewport position, or
// `null` when there is no mouse to follow.

const readers = new Set()
let point = null
let frame = 0

function flush() {
  frame = 0
  for (const read of readers) read(point)
}

// A burst of moves lands in one frame, and a single scroll moves every reader's box at once — coalesce
// both into one pass, so a page of trackers costs one layout read each per frame rather than one per event.
function schedule() {
  if (!frame) frame = requestAnimationFrame(flush)
}

function onMove(event) {
  // Touch and pen don't hover: a tap would otherwise leave every tracker leaning at wherever it landed.
  if (event.pointerType !== 'mouse') return release()
  point = { x: event.clientX, y: event.clientY }
  schedule()
}

// The pointer left the window, or the window lost it to another tab — there is nothing to follow now.
function release() {
  if (!point) return
  point = null
  schedule()
}

const PASSIVE = { passive: true }
const SCROLL = { passive: true, capture: true } // capture, so scrolling a pane inside the page counts too

function bind(method) {
  window[method]('pointermove', onMove, PASSIVE)
  window[method]('pointerdown', onMove, PASSIVE)
  document[method]('pointerleave', release)
  window[method]('blur', release)
  window[method]('scroll', schedule, SCROLL)
  window[method]('resize', schedule, PASSIVE)
}

// Returns an unsubscribe. The listeners only exist while something is reading, so a page with no tracker
// on it — every page, under reduced motion — pays nothing for this.
export function trackPointer(read) {
  if (readers.size === 0) bind('addEventListener')
  readers.add(read)
  read(point)

  return () => {
    readers.delete(read)
    if (readers.size > 0) return
    bind('removeEventListener')
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    point = null
  }
}
