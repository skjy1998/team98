import type { SelfMatchSide } from "@/types/match";

interface MatchTacticsSideTabsProps {
  selectedSide: SelfMatchSide;
  onChangeSide: (side: SelfMatchSide) => void;
}

const sideOptions: {
  value: SelfMatchSide;
  label: string;
}[] = [
  { value: "team_a", label: "A팀" },
  { value: "team_b", label: "B팀" },
];

export default function MatchTacticsSideTabs({
  selectedSide,
  onChangeSide,
}: Readonly<MatchTacticsSideTabsProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-stone-100 p-1">
      <div className="grid gird-cols-2 gap-1">
        {sideOptions.map((side) => {
          const isActive = selectedSide === side.value;

          return (
            <button
              key={side.value}
              type="button"
              onClick={() => onChangeSide(side.value)}
              className={[
                "rounded-lg px-4 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-stone-500 hover:bg-white/60 hover:text-stone-700",
              ].join(" ")}
            >
              {side.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
