"use client";

import PageHeader from "@/components/PageHeader";
import MatchSection from "@/components/matches/MatchSection";
import { useMemo, useState } from "react";
import MatchCreateModal from "@/components/matches/MatchCreateModal";
import { MatchCreateFormValue } from "@/types/match";
import { useMatches } from "@/hooks/useMatches";
import { getDisplayMatches, getIsUpcomingMatch } from "@/lib/match-ui";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";

export default function MatchesPageClient() {
  const { records } = useMatchRecordsMap();
  const { matches, matchesLoaded, addMatch } = useMatches();
  const { canManage, memberLoaded } = useCurrentTeamMember();

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

  const totalMatchesCount = displayMatches.length;
  const hasMatches = totalMatchesCount > 0;
  const emptyDescription = canManage
    ? "일정 등록 버튼으로 첫 경기를 추가해보세요."
    : "아직 등록된 경기 일정이 없어요.";

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateMatch = async (value: MatchCreateFormValue) => {
    const success = await addMatch(value);

    if (success) {
      setIsCreateOpen(false);
    }
  };

  if (!matchesLoaded || !memberLoaded) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        {canManage && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            + 일정 등록
          </button>
        )}
      </div>
      <p className="text-sm font-medium text-stone-500">
        총 {displayMatches.length}경기
      </p>
      {!canManage && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          현재 계정은 읽기 전용이에요. 회장 또는 운영진만 경기 일정을 등록하고
          수정할 수 있어요.
        </div>
      )}

      {!hasMatches ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-10 text-center">
          <p className="text-lg font-semibold text-stone-900">
            등록된 경기 일정이 없어요.
          </p>
          <p className="mt-2 text-sm text-stone-500">{emptyDescription}</p>
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
