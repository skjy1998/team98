import type {
  MatchOpponentRecordItem,
  MatchOpponentRecordSummary,
} from "@/types/match";
import { History } from "lucide-react";

interface MatchOpponentRecordCardProps {
  opponent: string;
  summary: MatchOpponentRecordSummary;
}

function getResultBadgeClassName(result: MatchOpponentRecordItem["result"]) {
  if (result === "win") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (result === "lose") {
    return "bg-rose-50 text-rose-500";
  }

  return "bg-stone-100 text-stone-600";
}

function getResultLabel(result: MatchOpponentRecordItem["result"]) {
  if (result === "win") return "승";
  if (result === "lose") return "패";
  return "무";
}

function formatRecentMatchDate(date: string) {
  return date.slice(5).replace("-", "/");
}

export default function MatchOpponentRecordCard({
  opponent,
  summary,
}: Readonly<MatchOpponentRecordCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
          <History className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
            {opponent} 상대 전적
          </h2>
          <p className="text-sm text-stone-400">이전 맞대결 기준 요약</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 sm:mt-5 sm:gap-3">
        <div className="rounded-xl bg-stone-50 px-1 py-3 text-center sm:px-4 sm:py-5">
          <p className="text-2xl font-bold text-stone-900 sm:text-3xl">
            {summary.totalMatches}
          </p>
          <p className="mt-1 text-[11px] text-stone-500">경기</p>
        </div>

        <div className="rounded-xl bg-stone-50 px-1 py-3 text-center sm:px-4 sm:py-5">
          <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">
            {summary.win}
          </p>
          <p className="mt-1 text-[11px] text-stone-500">승</p>
        </div>

        <div className="rounded-xl bg-stone-50 px-1 py-3 text-center sm:px-4 sm:py-5">
          <p className="text-2xl font-bold text-stone-700 sm:text-3xl">
            {summary.draw}
          </p>
          <p className="mt-1 text-[11px] text-stone-500">무</p>
        </div>

        <div className="rounded-xl bg-stone-50 px-1 py-3 text-center sm:px-4 sm:py-5">
          <p className="text-2xl font-bold text-rose-500 sm:text-3xl">
            {summary.lose}
          </p>
          <p className="mt-1 text-[11px] text-stone-500">패</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-3 text-stone-600">
          <span>
            득{" "}
            <span className="font-semibold text-stone-900">
              {summary.goals}
            </span>
          </span>
          <span>
            실{" "}
            <span className="font-semibold text-stone-900">
              {summary.conceded}
            </span>
          </span>
          <span>
            득실차{" "}
            <span
              className={[
                "font-semibold",
                summary.goalDiff > 0
                  ? "text-emerald-600"
                  : summary.goalDiff < 0
                    ? "text-rose-500"
                    : "text-stone-700",
              ].join(" ")}
            >
              {summary.goalDiff}
            </span>
          </span>
        </div>

        <span className="font-semibold text-stone-500">
          승률 {summary.winRate}%
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-500">최근 맞대결</p>
          <p className="text-xs text-stone-400">최신순</p>
        </div>

        {summary.recentMatches.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-stone-200 px-4 py-6 text-center text-sm text-stone-400">
            아직 이전 맞대결 기록이 없어요.
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {summary.recentMatches.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
              >
                <span className="text-sm font-medium text-stone-500">
                  {formatRecentMatchDate(item.date)}
                </span>

                <span className="text-base font-semibold text-stone-900">
                  {item.ourScore} : {item.opponentScore}
                </span>

                <span
                  className={[
                    "rounded-lg px-2.5 py-1 text-xs font-semibold",
                    getResultBadgeClassName(item.result),
                  ].join(" ")}
                >
                  {getResultLabel(item.result)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
