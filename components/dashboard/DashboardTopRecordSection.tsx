import Link from "next/link";

interface DashboardTopRecordPlayer {
  name: string;
  appearance: number;
  goal: number;
  assist: number;
}

interface DashboardTopRecordSectionProps {
  topAppearance?: DashboardTopRecordPlayer;
  topScorer?: DashboardTopRecordPlayer;
  topAssister?: DashboardTopRecordPlayer;
}

export default function DashboardTopRecordSection({
  topAppearance,
  topScorer,
  topAssister,
}: Readonly<DashboardTopRecordSectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">
          팀 주요 기록
        </span>
        <Link
          href="/stats"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
        >
          전체 보기
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-orange-200 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.10),_transparent_35%),linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-sm">
          <p className="text-sm font-semibold text-orange-400">최다 출전</p>
          <p className="mt-1 text-sm font-medium text-stone-500">
            {topAppearance?.name ?? "-"}
          </p>

          <div className="mt-4 flex items-end">
            <span className="text-4xl font-bold text-stone-900">
              {topAppearance?.appearance ?? 0}
            </span>
            <span className="ml-1 text-2xl font-semibold text-stone-500">
              경기
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.10),_transparent_35%),linear-gradient(180deg,#fafffc_0%,#ffffff_100%)] p-4 shadow-sm">
          <p className="text-sm font-semibold text-emerald-400">최다 득점</p>
          <p className="mt-1 text-sm font-medium text-stone-500">
            {topScorer?.name ?? "-"}
          </p>

          <div className="mt-4 flex items-end">
            <span className="text-4xl font-bold text-stone-900">
              {topScorer?.goal ?? 0}
            </span>
            <span className="ml-1 text-2xl font-semibold text-stone-500">
              골
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.10),_transparent_35%),linear-gradient(180deg,#fbfeff_0%,#ffffff_100%)] p-4 shadow-sm">
          <p className="text-sm font-semibold text-sky-400">최고 도움</p>
          <p className="mt-1 text-sm font-medium text-stone-500">
            {topAssister?.name ?? "-"}
          </p>

          <div className="mt-4 flex items-end">
            <span className="text-4xl font-bold text-stone-900">
              {topAssister?.assist ?? 0}
            </span>
            <span className="ml-1 text-2xl font-semibold text-stone-500">
              도움
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
