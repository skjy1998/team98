"use client";

import { MatchInfoTab } from "@/components/matches/detail/MatchInfoTab";
import MatchTabPlaceholder from "@/components/matches/detail/MatchTabPlaceholder";
import MatchVoteTab from "@/components/matches/detail/MatchVoteTab";
import { initialMatches } from "@/data/initialMatches";
import {
  ChevronLeft,
  ClipboardList,
  Info,
  LayoutGrid,
  NotebookPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type MatchDetailTab =
  | "info"
  | "vote"
  | "tactics"
  | "attendance"
  | "record"
  | "review";

const tabs: {
  id: MatchDetailTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "info", label: "정보", icon: Info },
  { id: "vote", label: "출석", icon: Users },
  { id: "tactics", label: "전술", icon: LayoutGrid },
  { id: "record", label: "기록", icon: ClipboardList },
  { id: "review", label: "후기", icon: NotebookPen },
];

export default function MatchDetailPage() {
  const [activeTab, setActiveTab] = useState<MatchDetailTab>("info");

  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const match = useMemo(
    () => initialMatches.find((item) => item.id === id),
    [id],
  );

  if (!match) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-stone-900">
          경기 정보를 찾을 수 없어요.
        </p>
        <Link
          href="/matches"
          className="mt-4 inline-flex text-sm font-medium text-emerald-700"
        >
          일정 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const matchStatusLabel =
    match.status === "win"
      ? "승"
      : match.status === "lose"
        ? "패"
        : match.status === "draw"
          ? "무"
          : "예정";

  const opponentName = match.title.replace("vs ", "");
  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ChevronLeft className="h-4 w-4" />
        일정 목록
      </Link>
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {/* 전광판 */}
        <div className="bg-stone-50/70 px-6 py-8 md:px-8">
          {/* 스코어보드 */}
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-3xl font-bold text-emerald-700">
                F
              </div>
              <p className="mt-3 text-xl font-semibold text-stone-900">FC 98</p>
            </div>
            <div className="text-center">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {matchStatusLabel}
              </span>
              <p className="mt-4 text-5xl font-bold tracking-tight text-stone-900">
                {match.score ?? "-"}
              </p>
              <p className="mt-2 text-sm text-stone-400">
                {match.isUpcoming ? "경기 전" : "종료"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100 text-3xl font-bold text-stone-700">
                {opponentName.slice(0, 1)}
              </div>
              <p className="mt-3 text-xl font-semibold text-stone-900">
                {opponentName}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-200 px-6 py-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-stone-500">
            <span>{match.date}</span>
            <span className="text-stone-300">|</span>
            <span>{match.time}</span>
            <span className="text-stone-300">|</span>
            <span>{match.location}</span>
          </div>
        </div>
      </section>
      {/* 탭 섹션 */}
      <section className="rounded-xl border border-stone-200 bg-white">
        <div className="grid grid-cols-3 border-b border-stone-200 md:grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex flex-col items-center justify-center gap-2 px-3 py-4 text-sm transition",
                  isActive
                    ? "border-b-2 border-emerald-600 text-stone-900"
                    : "border-b-2 border-transparent text-stone-400 hover:text-stone-700",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === "info" && <MatchInfoTab match={match} />}
      {activeTab === "tactics" && <MatchTabPlaceholder label="전술" />}
      {activeTab === "vote" && <MatchVoteTab matchId={match.id} />}
      {activeTab === "record" && <MatchTabPlaceholder label="기록" />}
      {activeTab === "review" && <MatchTabPlaceholder label="후기" />}
    </div>
  );
}
