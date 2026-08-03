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
          label: "공격포인트",
          value: player.attackPoint,
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
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">내 기록</h2>

      {!player ? (
        <p className="mt-4 text-sm text-stone-500">
          현재 계정에 연결된 선수 정보가 없어서 개인 기록을 불러올 수 없어요.
        </p>
      ) : (
        <div className="mt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {recordItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-stone-50 px-4 py-5 text-center"
              >
                <p className={`text-2xl font-bold ${item.valueClassName}`}>
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900">
                내 순위 요약
              </h3>
              <span className="text-xs font-medium text-stone-400">
                TEAM RANK
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {rankItems.map((item) => (
                <div key={item.label} className="rounded-lg bg-white px-4 py-4">
                  <p className="text-sm text-stone-500">{item.label}</p>
                  <p
                    className={`mt-2 text-xl font-bold ${item.valueClassName}`}
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
