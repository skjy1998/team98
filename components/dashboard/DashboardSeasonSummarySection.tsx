import { RecentResult } from "@/types/stats";

import DashboardSeasonSummaryCard from "./DashboardSeasonSummaryCard";
import Link from "next/link";

interface DashboardSeasonSummarySectionProps {
  win: number;
  draw: number;
  lose: number;
  recentResults: RecentResult[];
}

export default function DashboardSeasonSummarySection({
  win,
  draw,
  lose,
  recentResults,
}: Readonly<DashboardSeasonSummarySectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">시즌 전적</span>
        <Link
          href="/stats"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
        >
          통계 보기
        </Link>
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
