import type { DashboardTopRecordPlayer } from "@/types/dashboard";
import Link from "next/link";

interface DashboardMyRecordPlayer extends DashboardTopRecordPlayer {
  number?: number;
}

interface DashboardMyRecordSectionProps {
  player?: DashboardMyRecordPlayer;
}

const recordItems = [
  {
    key: "appearance",
    label: "출전",
    unit: "경기",
  },
  {
    key: "goal",
    label: "득점",
    unit: "골",
  },
  {
    key: "assist",
    label: "도움",
    unit: "개",
  },
] as const;

export default function DashboardMyRecordSection({
  player,
}: Readonly<DashboardMyRecordSectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">
          내 시즌 기록
        </span>

        <Link
          href="/stats?tab=me"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
        >
          전체 보기
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {player ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-lg font-bold text-emerald-700 shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                {player.name.slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-stone-900 sm:text-lg">
                  {player.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-stone-400">
                  이번 시즌 기록
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:px-3 sm:text-sm">
                {player.number !== undefined ? `#${player.number}` : "미배정"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
              {recordItems.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-stone-100 bg-stone-50/70 px-2 py-3 text-center sm:px-3 sm:py-4"
                >
                  <p className="text-xs font-semibold text-stone-400">
                    {item.label}
                  </p>

                  <p className="mt-2 text-xl font-bold text-stone-900 sm:text-2xl">
                    {player[item.key]}
                    <span className="ml-1 text-xs font-semibold text-stone-400">
                      {item.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm font-medium text-stone-500">
              계정에 연결된 선수 정보가 없어요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
