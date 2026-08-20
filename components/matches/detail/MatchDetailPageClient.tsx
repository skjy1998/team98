"use client";
import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";
import { MatchInfoTab } from "@/components/matches/detail/info/MatchInfoTab";
import MatchTacticsTab from "@/components/matches/detail/tactics/MatchTacticsTab";
import MatchVoteTab from "@/components/matches/detail/vote/MatchVoteTab";
import { useCurrentTeam } from "@/hooks/team/useCurrentTeam";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import { useMatches } from "@/hooks/matches/useMatches";
import useMatchRecordsMap from "@/hooks/matches/useMatchRecordMap";
import { useMatchRecords } from "@/hooks/matches/useMatchRecords";
import {
  getDisplayMatches,
  getMatchDetailDisplay,
  getMatchDetailTab,
} from "@/lib/matches/match-ui";
import type {
  MatchCreateFormValue,
  MatchDetailTab,
  MatchPlayersPerSide,
} from "@/types/match";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import MatchRecordTab from "./record/MatchRecordTab";
import { useMatchAttendance } from "@/hooks/matches/useMatchAttendance";
import { useMatchVotes } from "@/hooks/matches/useMatchVotes";
import { usePlayers } from "@/hooks/players/usePlayers";
import MatchAttendanceTab from "./attendance/MatchAttendanceTab";
import ContentState from "@/components/common/ContentState";
import { useToastStore } from "@/stores/toast-store";
import { useConfirmStore } from "@/stores/confirm-store";

interface MatchDetailPageClientProps {
  matchId: string;
}

export default function MatchDetailPageClient({
  matchId,
}: Readonly<MatchDetailPageClientProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  // 1. 라우터 / search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getMatchDetailTab(searchParams.get("tab"));

  // 2. 기본 데이터 hooks
  const {
    matches,
    matchesLoaded,
    updateMatch,
    updateMatchPlayersPerSide,
    setMatchRecordCompletion,
    deleteMatch: removeMatch,
  } = useMatches({ includeAllSeasons: true });

  const { records, recordsLoaded: recordsMapLoaded } = useMatchRecordsMap();
  const { votes, votesLoaded } = useMatchVotes();
  const { players, playersLoaded } = usePlayers();
  const { canManage, memberLoaded } = useCurrentTeamMember();
  const { team, teamLoaded } = useCurrentTeam();
  const { attendance, attendanceLoaded, saveAttendance, deleteAttendance } =
    useMatchAttendance();

  const matchVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);
  const matchAttendance = attendance[matchId] ?? [];

  const attendPlayerIds = useMemo(
    () =>
      new Set(
        matchVotes
          .filter((vote) => vote.status === "attend")
          .map((vote) => vote.playerId),
      ),
    [matchVotes],
  );

  const attendancePlayers = useMemo(
    () => players.filter((player) => attendPlayerIds.has(player.id)),
    [players, attendPlayerIds],
  );

  // 4. 첫 번째 파생값들
  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );
  const match = matches.find((item) => item.id === matchId);
  const targetMatchId = match?.id ?? "";

  // 5. records hook
  const {
    loaded: matchRecordsLoaded,
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
      showToast("경기 정보 수정에 실패했어요.", "error");
      return false;
    }
    showToast("경기 정보가 수정됐어요.", "success");

    return true;
  };

  const handleDeleteMatch = async () => {
    if (!match) return;

    const confirmed = await confirm({
      title: "경기 삭제",
      description: `${match.title} 경기를 삭제할까요? 연결된 기록과 출석 데이터도 함께 삭제되며 되돌릴 수 없어요.`,
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await removeMatch(match.id);

    if (!success) {
      showToast("경기 삭제에 실패했어요.", "error");
      return;
    }

    showToast("경기를 삭제했어요.", "success");
    router.push("/matches");
  };

  const handleChangeRecordCompletion = async (completed: boolean) => {
    if (!match) return false;

    return setMatchRecordCompletion(match.id, completed);
  };

  const handleChangePlayersPerSide = async (
    playersPerSide: MatchPlayersPerSide,
  ) => {
    if (!match) return false;

    return updateMatchPlayersPerSide(match.id, playersPerSide);
  };

  // 7. early return
  if (
    !teamLoaded ||
    !matchesLoaded ||
    !recordsMapLoaded ||
    !memberLoaded ||
    !votesLoaded ||
    !playersLoaded ||
    !attendanceLoaded
  ) {
    return (
      <ContentState
        variant="loading"
        title="경기 정보를 불러오는 중..."
        description="경기 일정과 상세 기록을 준비하고 있어요."
      />
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
    matchRecordsLoaded && (events.length > 0 || match.recordCompletedAt)
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
          onDelete={handleDeleteMatch}
          canManage={canManage}
        />
      )}

      {activeTab === "vote" && (
        <MatchVoteTab matchId={match.id} match={resolvedMatch} />
      )}
      {activeTab === "attendance" && (
        <MatchAttendanceTab
          matchId={match.id}
          players={attendancePlayers}
          attendance={matchAttendance}
          canManage={canManage}
          saveAttendance={saveAttendance}
          deleteAttendance={deleteAttendance}
        />
      )}

      {activeTab === "tactics" && (
        <MatchTacticsTab
          matchId={match.id}
          sport={match.sport}
          playersPerSide={match.playersPerSide}
          onChangePlayersPerSide={handleChangePlayersPerSide}
          canManage={canManage}
        />
      )}

      {activeTab === "record" && (
        <MatchRecordTab
          matchId={match.id}
          events={events}
          recordsLoaded={matchRecordsLoaded}
          recordCompletedAt={match.recordCompletedAt}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          updateEvent={updateEvent}
          reorderEvents={reorderEvents}
          onChangeCompletion={handleChangeRecordCompletion}
          canManage={canManage}
        />
      )}
    </div>
  );
}
