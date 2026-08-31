import { getMatchResult, getOpponentName } from "@/lib/matches/match-display";
import type { MatchItem } from "@/types/match";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface DashboardRecentMatchBarProps {
  match: MatchItem;
}

const resultMeta = {
  win: {
    label: "승",
    className: "bg-emerald-50 text-emerald-600",
  },
  draw: {
    label: "무",
    className: "bg-stone-100 text-stone-500",
  },
  lose: {
    label: "패",
    className: "bg-rose-50 text-rose-500",
  },
} as const;

export default function DashboardRecentMatchBar({
  match,
}: Readonly<DashboardRecentMatchBarProps>) {
  const result = getMatchResult(match);

  if (result !== "win" && result !== "draw" && result !== "lose") {
    return null;
  }

  const meta = resultMeta[result];

  return (
    <Link
      href={`/matches/${match.id}`}
      className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
    >
      <span className="shrink-0 text-xs font-semibold text-stone-400">
        최근 경기
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800">
        vs {getOpponentName(match)}
      </span>

      <span className="shrink-0 text-base font-bold text-stone-900">
        {match.ourScore} : {match.opponentScore}
      </span>

      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${meta.className}`}
      >
        {meta.label}
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-stone-300" />
    </Link>
  );
}
