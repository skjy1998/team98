import { RecentResult } from "@/types/stats";
import DashboardSeasonSummaryCard from "./DashboardSeasonSummaryCard";

interface DashboardSeasonSummarySectionProps {
  total: number;
  win: number;
  draw: number;
  lose: number;
  recentResults: RecentResult[];
}

export default function DashboardSeasonSummarySection({
  total,
  win,
  draw,
  lose,
  recentResults,
}: Readonly<DashboardSeasonSummarySectionProps>) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-900 sm:text-sm">
          시즌 전적
        </span>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500 sm:px-3 sm:text-xs">
          총 {total}경기
        </span>
      </div>

      <DashboardSeasonSummaryCard
        win={win}
        draw={draw}
        lose={lose}
        recentResults={recentResults}
      />
    </section>
  );
}
