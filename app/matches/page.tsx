"use client";

import PageHeader from "@/components/PageHeader";
import MatchSection from "@/components/matches/MatchSection";
import { useMemo, useState } from "react";
import MatchCreateModal from "@/components/matches/MatchCreateModal";
import { MatchCreateFormValue, MatchItem } from "@/types/match";
import { useMatches } from "@/hooks/useMatches";
import { getDisplayMatches, getIsUpcomingMatch } from "@/lib/match-ui";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";

export default function MatchesPage() {
  const { records } = useMatchRecordsMap();
  const { matches, setMatches, matchesLoaded } = useMatches();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );

  const upcomingMatches = useMemo(
    () =>
      displayMatches
        .filter((match) => getIsUpcomingMatch(match.date))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [displayMatches],
  );
  const pastMatches = useMemo(
    () =>
      displayMatches
        .filter((match) => !getIsUpcomingMatch(match.date))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [displayMatches],
  );

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateMatch = (value: MatchCreateFormValue) => {
    const newMatch: MatchItem = {
      id: crypto.randomUUID(),
      title: value.title,
      type: value.type,
      date: value.date,
      startTime: value.startTime,
      endTime: value.endTime,
      location: value.location,
      opponent: value.opponent,
      status: "scheduled",
      isUpcoming: getIsUpcomingMatch(value.date),
    };
    setMatches((prev) => [newMatch, ...prev]);
    setIsCreateOpen(false);
  };

  if (!matchesLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-sm text-stone-500">경기 일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="경기 일정"
        description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
      />
      <button
        type="button"
        onClick={handleOpenCreate}
        className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        일정 등록
      </button>
      {upcomingMatches.length === 0 && pastMatches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-10 text-center">
          <p className="text-lg font-semibold text-stone-900">
            등록된 경기 일정이 없어요.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            일정 등록 버튼으로 첫 경기를 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      )}
      {isCreateOpen && (
        <MatchCreateModal
          onClose={handleCloseCreate}
          onSave={handleCreateMatch}
        />
      )}
    </div>
  );
}
