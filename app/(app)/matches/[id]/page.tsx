"use client";

import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";
import { MatchInfoTab } from "@/components/matches/detail/MatchInfoTab";
import MatchRecordTab from "@/components/matches/detail/MatchRecordTab";
import MatchTabPlaceholder from "@/components/matches/detail/MatchTabPlaceholder";
import MatchTacticsTab from "@/components/matches/detail/MatchTacticsTab";
import MatchVoteTab from "@/components/matches/detail/MatchVoteTab";
import MatchDeleteModal from "@/components/matches/MatchDeleteModal";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import { useMatches } from "@/hooks/useMatches";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { useMatchRecords } from "@/hooks/useMatchRecords";
import {
  getDisplayMatches,
  getMatchDetailStatusLabel,
  getMatchDetailSubText,
  getMatchDetailTab,
  getMatchResult,
  getOpponentName,
  statusMap,
} from "@/lib/match-ui";
import type {
  MatchCreateFormValue,
  MatchDetailTab,
  MatchItem,
} from "@/types/match";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MatchDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const activeTab = getMatchDetailTab(searchParams.get("tab"));
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const {
    matches,
    matchesLoaded,
    updateMatch,
    deleteMatch: removeMatch,
  } = useMatches();
  const { records } = useMatchRecordsMap();
  const { canManage, memberLoaded } = useCurrentTeamMember();

  const [deleteTarget, setDeleteTarget] = useState<MatchItem | null>(null);
  const displayMatches = getDisplayMatches(matches, records);
  const match = matches.find((item) => item.id === id);
  const safeMatchId = match?.id ?? "";

  const {
    loaded: recordsLoaded,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
  } = useMatchRecords(safeMatchId);

  const handleChangeTab = (tab: MatchDetailTab) => {
    if (!safeMatchId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/matches/${safeMatchId}?${params.toString()}`);
  };

  const handleOpenDelete = () => {
    if (!match) return;
    setDeleteTarget(match);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleUpdateMatch = async (value: MatchCreateFormValue) => {
    if (!match) return;

    const success = await updateMatch(match.id, value);

    if (!success) {
      globalThis.alert("경기 정보 수정에 실패했어요.");
    }
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

  const resolvedMatch =
    recordsLoaded && events.length > 0
      ? {
          ...match,
          ourScore,
          opponentScore,
        }
      : match;

  const displayScore =
    resolvedMatch.ourScore !== undefined &&
    resolvedMatch.opponentScore !== undefined
      ? `${resolvedMatch.ourScore}:${resolvedMatch.opponentScore}`
      : "-";

  const result = getMatchResult(resolvedMatch);
  const matchStatusLabel = getMatchDetailStatusLabel(resolvedMatch);
  const status = statusMap[result];
  const matchSubText = getMatchDetailSubText(resolvedMatch);
  const opponentName = getOpponentName(resolvedMatch);

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
        displayScore={displayScore}
        matchStatusLabel={matchStatusLabel}
        matchSubText={matchSubText}
        opponentName={opponentName}
        statusBadgeClassName={status.badgeClassName}
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
      {activeTab === "tactics" && <MatchTacticsTab matchId={match.id} />}
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
