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
        "rounded-xl border border-orange-200 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.10),_transparent_35%),linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-orange-400",
    },
    {
      title: "최다 득점",
      name: topScorer?.name ?? "-",
      value: topScorer?.goal ?? 0,
      unit: "골",
      cardClassName:
        "rounded-xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.10),_transparent_35%),linear-gradient(180deg,#fafffc_0%,#ffffff_100%)] p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-emerald-400",
    },
    {
      title: "최고 도움",
      name: topAssister?.name ?? "-",
      value: topAssister?.assist ?? 0,
      unit: "도움",
      cardClassName:
        "rounded-xl border border-sky-200 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.10),_transparent_35%),linear-gradient(180deg,#fbfeff_0%,#ffffff_100%)] p-4 shadow-sm",
      titleClassName: "text-sm font-semibold text-sky-400",
    },
  ];

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
