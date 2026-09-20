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
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5">
      <div>
        <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
          최근 5경기
        </h3>
        <p className="mt-1 text-xs text-stone-400 sm:text-sm">
          최근 경기의 출석과 공격 기록이에요.
        </p>
      </div>
      {matches.length === 0 ? (
        <div className="flex min-h-24 items-center justify-center text-xs text-stone-400 sm:min-h-32 sm:text-sm">
          아직 확인할 수 있는 경기 기록이 없어요.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-stone-100 sm:mt-5">
          {matches.map((match) => {
            const status = attendanceStyle[match.attendanceStatus];

            return (
              <div
                key={match.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3 sm:py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-stone-900">
                    {match.title}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {formatMatchDate(match.date)}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${status.className}`}
                >
                  {status.label}
                </span>
                <div className="col-span-2 flex items-center gap-3 text-xs sm:col-auto sm:gap-4 sm:text-sm">
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
