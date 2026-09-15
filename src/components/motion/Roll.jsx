// Label roll for UI text (buttons, nav, footer links): on hover the label shunts up out of its slot and an
// identical copy rises into it. Pure CSS (`.roll` in index.css) — the host needs `.btn` or `.roll-host`.
export default function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
