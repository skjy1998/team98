import type { PlayerRecentMatch, StatsPlayerRow } from "@/types/stats";
import MyRecentMatchesCard from "./MyRecentMatchesCard";

interface MyStatsTabProps {
  data: {
    player?: StatsPlayerRow;
    goalRank: number | null;
    assistRank: number | null;
    appearanceRank: number | null;
    recentMatches: PlayerRecentMatch[];
  };
}

export default function MyStatsTab({ data }: Readonly<MyStatsTabProps>) {
  const { player, goalRank, assistRank, appearanceRank, recentMatches } = data;
  const recordItems = player
    ? [
        {
          label: "출전",
          value: player.appearance,
          valueClassName: "text-stone-900",
        },
        {
          label: "득점",
          value: player.goal,
          valueClassName: "text-emerald-600",
        },
        {
          label: "어시스트",
          value: player.assist,
          valueClassName: "text-sky-600",
        },
        {
          label: "MVP",
          value: player.mvpCount,
          valueClassName: "text-amber-600",
        },
        {
          label: "출석률",
          value: `${player.attendanceRate}%`,
          valueClassName: "text-violet-600",
        },
      ]
    : [];

  const rankItems = [
    {
      label: "득점 순위",
      rank: goalRank,
      valueClassName: "text-emerald-600",
    },
    {
      label: "어시스트 순위",
      rank: assistRank,
      valueClassName: "text-sky-600",
    },
    {
      label: "출전 순위",
      rank: appearanceRank,
      valueClassName: "text-amber-600",
    },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-6">
      <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
        내 기록
      </h2>

      {!player ? (
        <p className="mt-4 text-sm text-stone-500">
          현재 계정에 연결된 선수 정보가 없어서 개인 기록을 불러올 수 없어요.
        </p>
      ) : (
        <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-6">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-5 sm:gap-4">
            {recordItems.map((item, index) => (
              <div
                key={item.label}
                className={`col-span-2 rounded-xl bg-stone-50 px-2 py-3 text-center sm:col-span-1 sm:px-4 sm:py-5 ${
                  index === 3 ? "col-start-2 sm:col-auto" : ""
                }`}
              >
                <p
                  className={`text-lg font-bold sm:text-2xl ${item.valueClassName}`}
                >
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] text-stone-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900 sm:text-base">
                내 순위 요약
              </h3>
              <span className="text-xs font-medium text-stone-400">
                TEAM RANK
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              {rankItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-white px-2 py-3 sm:px-4 sm:py-4"
                >
                  <p className="text-[11px] text-stone-500 sm:text-sm">
                    {item.label}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold sm:text-xl ${item.valueClassName}`}
                  >
                    {item.rank ? `${item.rank}위` : "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <MyRecentMatchesCard matches={recentMatches} />
        </div>
      )}
    </section>
  );
}
