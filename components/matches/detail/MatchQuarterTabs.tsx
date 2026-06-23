import { MatchQuarter } from "@/types/tactics";

interface MatchQuarterTabsProps {
  quarters: MatchQuarter[];
  selectedQuarter: MatchQuarter;
  onChangeQuarter: (quarter: MatchQuarter) => void;
}

export default function MatchQuarterTabs({
  quarters,
  selectedQuarter,
  onChangeQuarter,
}: Readonly<MatchQuarterTabsProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-1">
      <div className="grid grid-cols-4 gap-1">
        {quarters.map((quarter) => {
          const isActive = selectedQuarter === quarter;

          return (
            <button
              key={quarter}
              type="button"
              onClick={() => onChangeQuarter(quarter)}
              className={[
                "rounded-lg px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-stone-500 hover:bg-stone-50",
              ].join(" ")}
            >
              {quarter}
            </button>
          );
        })}
      </div>
    </section>
  );
}
