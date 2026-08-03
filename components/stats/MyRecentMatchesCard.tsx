import type { PlayerRecentMatch } from "@/types/stats";

interface MyRecentMatchesCardProps {
  matches: PlayerRecentMatch[];
}

const attendanceStyle = {
  attend: {
    label: "참석",
    className: "bg-emerald-50 text-emerald-700",
  },
  late: {
    label: "지각",
    className: "bg-amber-50 text-amber-700",
  },
  absent: {
    label: "불참",
    className: "bg-rose-50 text-rose-600",
  },
  unchecked: {
    label: "미체크",
    className: "bg-stone-100 text-stone-500",
  },
} as const;

function formatMatchDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

export default function MyRecentMatchesCard({
  matches,
}: Readonly<MyRecentMatchesCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">최근 5경기</h3>
        <p className="mt-1 text-sm text-stone-400">
          최근 경기의 출석과 공격 기록이에요.
        </p>
      </div>
      {matches.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center text-sm text-stone-400">
          아직 확인할 수 있는 경기 기록이 없어요.
        </div>
      ) : (
        <div className="mt-5 divide-y divide-stone-100">
          {matches.map((match) => {
            const status = attendanceStyle[match.attendanceStatus];

            return (
              <div
                key={match.id}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-stone-900">
                    {match.title}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {formatMatchDate(match.date)}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <p className="text-stone-500">
                    득점{" "}
                    <strong className="text-emerald-600">{match.goal}</strong>
                  </p>
                  <p className="text-stone-500">
                    도움{" "}
                    <strong className="text-sky-600">{match.assist}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
