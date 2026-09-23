import Link from "next/link";
import DashboardTopRecordCard from "./DashboardTopRecordCard";
import type { DashboardTopRecordPlayer } from "@/types/dashboard";

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
  const cards = [
    {
      title: "최다 출전",
      name: topAppearance?.name ?? "-",
      value: topAppearance?.appearance ?? 0,
      unit: "경기",
      cardClassName:
        "rounded-xl border border-stone-200 bg-[radial-gradient(circle_at_top_right,_rgba(168,162,158,0.12),_transparent_35%),linear-gradient(180deg,#fafaf9_0%,#ffffff_100%)] p-3 sm:p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-stone-400",
    },
    {
      title: "최다 득점",
      name: topScorer?.name ?? "-",
      value: topScorer?.goal ?? 0,
      unit: "골",
      cardClassName:
        "rounded-xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.10),_transparent_35%),linear-gradient(180deg,#fafffc_0%,#ffffff_100%)] p-3 sm:p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-emerald-400",
    },
    {
      title: "최고 도움",
      name: topAssister?.name ?? "-",
      value: topAssister?.assist ?? 0,
      unit: "도움",
      cardClassName:
        "rounded-xl border border-sky-200 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.10),_transparent_35%),linear-gradient(180deg,#fbfeff_0%,#ffffff_100%)] p-3 sm:p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-sky-400",
    },
  ];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-900 sm:text-sm">
          팀 주요 기록
        </span>
        <Link
          href="/stats"
          className="text-xs font-medium text-stone-500 transition hover:text-stone-800 sm:text-sm"
        >
          전체 보기
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {cards.map((card) => (
          <DashboardTopRecordCard
            key={card.title}
            title={card.title}
            name={card.name}
            value={card.value}
            unit={card.unit}
            cardClassName={card.cardClassName}
            titleClassName={card.titleClassName}
          />
        ))}
      </div>
    </section>
  );
}
