import type { TeamHighlights } from "@/types/stats";
import { Crosshair, Flame, ShieldCheck, Trophy } from "lucide-react";

interface TeamHighlightsCardProps {
  highlights: TeamHighlights;
}

export default function TeamHighlightsCard({
  highlights,
}: Readonly<TeamHighlightsCardProps>) {
  const highestScoringMatch = highlights.highestScoringMatch;
  const biggestWin = highlights.biggestWin;

  const items = [
    {
      label: "최다 득점 경기",
      value: highestScoringMatch ? `${highestScoringMatch.goals}골` : "-",
      description: highestScoringMatch
        ? `${highestScoringMatch.title} · ${highestScoringMatch.goals}:${highestScoringMatch.conceded}`
        : "경기 기록 없음",
      icon: Crosshair,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "최다 점수차 승리",
      value: biggestWin
        ? `${biggestWin.goals - biggestWin.conceded}골 차`
        : "-",
      description: biggestWin
        ? `${biggestWin.title} · ${biggestWin.goals}:${biggestWin.conceded}`
        : "승리 기록 없음",
      icon: Trophy,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      label: "무실점 경기",
      value: `${highlights.cleanSheetCount}경기`,
      description: "상대 득점을 허용하지 않은 경기",
      icon: ShieldCheck,
      iconClassName: "bg-sky-50 text-sky-600",
    },
    {
      label: "현재 연속 무패",
      value: `${highlights.currentUnbeatenStreak}경기`,
      description: "가장 최근 경기부터 계산",
      icon: Flame,
      iconClassName: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section>
      <div>
        <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
          팀 기록 하이라이트
        </h2>
        <p className="mt-1 text-xs text-stone-400 sm:text-sm">
          지금까지 쌓인 팀의 주요 기록이에요.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-stone-200 bg-white p-3 sm:p-5"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${item.iconClassName}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <p className="mt-3 text-xs font-medium text-stone-500 sm:mt-4 sm:text-sm">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-stone-900 sm:text-2xl">
                {item.value}
              </p>
              <p className="mt-1.5 truncate text-[11px] text-stone-400 sm:mt-2 sm:text-xs">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
