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
    valueClassName: "text-orange-500",
  },
  {
    key: "goal",
    label: "득점",
    unit: "골",
    valueClassName: "text-emerald-600",
  },
  {
    key: "assist",
    label: "도움",
    unit: "개",
    valueClassName: "text-sky-500",
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

      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.12),_transparent_35%),linear-gradient(180deg,#f8fffb_0%,#ffffff_100%)] p-5 shadow-sm">
        {player ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-xl font-bold text-emerald-700 shadow-sm">
                {player.name.slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-stone-900">
                  {player.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-stone-400">
                  이번 시즌 기록
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {player.number !== undefined ? `#${player.number}` : "미배정"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {recordItems.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-white/80 bg-white/80 px-3 py-4 text-center shadow-sm"
                >
                  <p className="text-xs font-semibold text-stone-400">
                    {item.label}
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${item.valueClassName}`}
                  >
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
