"use client";
import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";
import { MatchInfoTab } from "@/components/matches/detail/MatchInfoTab";

import MatchTabPlaceholder from "@/components/matches/detail/MatchTabPlaceholder";
import MatchTacticsTab from "@/components/matches/detail/tactics/MatchTacticsTab";
import MatchVoteTab from "@/components/matches/detail/vote/MatchVoteTab";
import MatchDeleteModal from "@/components/matches/MatchDeleteModal";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import { useMatches } from "@/hooks/matches/useMatches";
import useMatchRecordsMap from "@/hooks/matches/useMatchRecordMap";
import { useMatchRecords } from "@/hooks/matches/useMatchRecords";
import {
  getDisplayMatches,
  getMatchDetailDisplay,
  getMatchDetailTab,
} from "@/lib/match-ui";
import type {
  MatchCreateFormValue,
  MatchDetailTab,
  MatchItem,
} from "@/types/match";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import MatchRecordTab from "./record/MatchRecordTab";

interface MatchDetailPageClientProps {
  matchId: string;
}

export default function MatchDetailPageClient({
  matchId,
}: Readonly<MatchDetailPageClientProps>) {
  // 1. 라우터 / search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getMatchDetailTab(searchParams.get("tab"));

  // 2. 기본 데이터 hooks
  const {
    matches,
    matchesLoaded,
    updateMatch,
    deleteMatch: removeMatch,
  } = useMatches();
  const { records } = useMatchRecordsMap();
  const { canManage, memberLoaded } = useCurrentTeamMember();
  const { team } = useCurrentTeam();

  // 3. UI state
  const [deleteTarget, setDeleteTarget] = useState<MatchItem | null>(null);

  // 4. 첫 번째 파생값들
  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );
  const match = matches.find((item) => item.id === matchId);
  const targetMatchId = match?.id ?? "";

  // 5. records hook
  const {
    loaded: recordsLoaded,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
  } = useMatchRecords(targetMatchId);

  // 6. handler 함수들
  const handleChangeTab = (tab: MatchDetailTab) => {
    if (!targetMatchId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/matches/${targetMatchId}?${params.toString()}`);
  };

  const handleUpdateMatch = async (value: MatchCreateFormValue) => {
    if (!match) return false;

    const success = await updateMatch(match.id, value);

    if (!success) {
      globalThis.alert("경기 정보 수정에 실패했어요.");
      return false;
    }

    return true;
  };

  const handleOpenDelete = () => {
    if (!match) return;
    setDeleteTarget(match);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleDeleteMatch = async () => {
    if (!deleteTarget) return;

    const success = await removeMatch(deleteTarget.id);

    if (!success) {
      globalThis.alert("경기 삭제에 실패했어요.");
      return;
    }

    setDeleteTarget(null);
    router.push("/matches");
  };

  // 7. early return
  if (!matchesLoaded || !memberLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">경기 정보를 불러오는 중...</p>
      </div>
    );
  }

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

  // 8. 최종 파생값
  const resolvedMatch =
    recordsLoaded && events.length > 0
      ? {
          ...match,
          ourScore,
          opponentScore,
        }
      : match;

  const {
    displayScore,
    matchStatusLabel,
    matchSubText,
    opponentName,
    statusBadgeClassName,
  } = getMatchDetailDisplay(resolvedMatch);

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ChevronLeft className="h-4 w-4" />
        일정 목록
      </Link>

      <MatchDetailHeader
        match={resolvedMatch}
        teamName={team?.name ?? "우리 팀"}
        displayScore={displayScore}
        matchStatusLabel={matchStatusLabel}
        matchSubText={matchSubText}
        opponentName={opponentName}
        statusBadgeClassName={statusBadgeClassName}
      />

      <MatchDetailTabs activeTab={activeTab} onChange={handleChangeTab} />
      {activeTab === "info" && (
        <MatchInfoTab
          match={resolvedMatch}
          matches={displayMatches}
          onSave={handleUpdateMatch}
          onDelete={handleOpenDelete}
          canManage={canManage}
        />
      )}

      {activeTab === "vote" && (
        <MatchVoteTab matchId={match.id} match={resolvedMatch} />
      )}

      {activeTab === "tactics" && (
        <MatchTacticsTab matchId={match.id} canManage={canManage} />
      )}

      {activeTab === "record" && (
        <MatchRecordTab
          matchId={match.id}
          events={events}
          recordsLoaded={recordsLoaded}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          updateEvent={updateEvent}
          reorderEvents={reorderEvents}
          canManage={canManage}
        />
      )}
      {activeTab === "review" && <MatchTabPlaceholder label="후기" />}
      {deleteTarget && (
        <MatchDeleteModal
          match={deleteTarget}
          onClose={handleCloseDelete}
          onDelete={handleDeleteMatch}
        />
      )}
    </div>
  );
}
