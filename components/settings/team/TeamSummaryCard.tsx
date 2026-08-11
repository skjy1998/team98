import type { TeamSettingsSummary } from "@/types/team";
import { Link2Off, UserRoundCheck, Users } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

interface TeamSummaryCardProps {
  summary: TeamSettingsSummary;
}

const summaryItems: Array<{
  key: keyof TeamSettingsSummary;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
}> = [
  {
    key: "playerCount",
    label: "등록 선수",
    description: "선수 관리에 등록된 인원",
    icon: Users,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "accountCount",
    label: "가입 계정",
    description: "팀에 가입한 사용자",
    icon: UserRoundCheck,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    key: "unlinkedPlayerCount",
    label: "미연결 선수",
    description: "계정이 연결되지 않은 선수",
    icon: Link2Off,
    iconClassName: "bg-amber-50 text-amber-600",
  },
];

export default function TeamSummaryCard({
  summary,
}: Readonly<TeamSummaryCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">팀 현황</h2>
          <p className="mt-1 text-sm text-stone-400">
            현재 팀원과 계정 연결 상태를 확인하세요.
          </p>
        </div>

        <Link
          href="/players"
          className="shrink-0 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          선수 관리
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="rounded-xl border border-stone-200 bg-stone-50 p-4"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconClassName}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <p className="mt-4 text-2xl font-bold text-stone-900">
                {summary[item.key]}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-700">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-stone-400">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
