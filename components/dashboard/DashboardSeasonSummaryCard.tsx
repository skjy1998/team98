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
    <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm sm:p-5">
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        <div className="text-center">
          <p className="text-3xl font-bold leading-none text-emerald-400 sm:text-4xl">
            {win}
          </p>
          <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">
            승
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold leading-none text-stone-500 sm:text-4xl">
            {draw}
          </p>
          <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">
            무
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold leading-none text-rose-400 sm:text-4xl">
            {lose}
          </p>
          <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">
            패
          </p>
        </div>
      </div>
      <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="shrink-0 text-xs font-semibold text-stone-400 sm:text-sm">
            최근 5경기
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
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
