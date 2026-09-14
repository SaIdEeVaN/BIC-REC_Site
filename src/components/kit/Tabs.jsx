// Filter tabs: joined cells, selected tab is ink fill with bone text.
export default function Tabs({ options, value, onChange, label, className = '' }) {
  return (
    <div role="group" aria-label={label} className={`cells flex flex-wrap ${className}`}>
      {options.map((option) => {
        const selected = option === value
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`px-4 py-2.5 text-[13.5px] font-extrabold uppercase ${
              selected ? 'bg-ink text-bone' : 'bg-bone decoration-[3px] underline-offset-4 hover:underline'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
