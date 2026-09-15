const legendItems = [
  {
    label: "승",
    className: "bg-emerald-400",
  },
  {
    label: "무",
    className: "bg-amber-400",
  },
  {
    label: "패",
    className: "bg-rose-400",
  },
  {
    label: "혼합",
    className: "bg-sky-400",
  },
] as const;

export default function MatchCalendarLegend() {
  return (
    <div className="flex items-center gap-4" aria-label="경기 결과 색상 안내">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${item.className}`}
            aria-hidden="true"
          />
          <span className="text-[11px] font-medium text-stone-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
