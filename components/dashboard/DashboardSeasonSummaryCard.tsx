import { RecentResult } from "@/types/stats";

interface DashboardSeasonSummaryCardProps {
  win: number;
  draw: number;
  lose: number;
  recentResults: RecentResult[];
}

const recentResultStyles = {
  win: "border-emerald-200 bg-emerald-50 text-emerald-600",
  draw: "border-stone-200 bg-stone-100 text-stone-500",
  lose: "border-rose-200 bg-rose-50 text-rose-500",
} as const;

const recentResultLabel = {
  win: "W",
  draw: "D",
  lose: "L",
} as const;

export default function DashboardSeasonSummaryCard({
  win,
  draw,
  lose,
  recentResults,
}: Readonly<DashboardSeasonSummaryCardProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        <div className="text-center">
          <p className="text-4xl font-bold leading-none text-emerald-400">
            {win}
          </p>
          <p className="mt-1 text-sm font-medium text-stone-500">승</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold leading-none text-stone-500">
            {draw}
          </p>
          <p className="mt-1 text-sm font-medium text-stone-500">무</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold leading-none text-rose-400">
            {lose}
          </p>
          <p className="mt-1 text-sm font-medium text-stone-500">패</p>
        </div>
      </div>
      <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-400">최근 5경기</p>

          <div className="flex items-center gap-2">
            {recentResults.map((result, index) => (
              <span
                key={`${result}-${index}`}
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                  recentResultStyles[result],
                ].join(" ")}
              >
                {recentResultLabel[result]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
