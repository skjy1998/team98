"use client";
import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";
import { MatchInfoTab } from "@/components/matches/detail/info/MatchInfoTab";
import MatchTacticsTab from "@/components/matches/detail/tactics/MatchTacticsTab";
import MatchVoteTab from "@/components/matches/detail/vote/MatchVoteTab";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import MatchRecordTab from "./record/MatchRecordTab";
import MatchAttendanceTab from "./attendance/MatchAttendanceTab";
import ContentState from "@/components/common/ContentState";
import { useMatchDetailPageData } from "@/hooks/matches/useMatchDetailPageData";
import { useMatchDetailActions } from "@/hooks/matches/useMatchDetailActions";

interface MatchDetailPageClientProps {
  matchId: string;
}

export default function MatchDetailPageClient({
  matchId,
}: Readonly<MatchDetailPageClientProps>) {
  const {
    team,
    canManage,
    isLoaded,
    pageError,
    reloadPageData,
    match,
    resolvedMatch,
    matchDisplay,
    displayMatches,
    hasMatchStarted,
    matchVotes,
    matchAttendance,
    attendancePlayers,
    matchRecordsLoaded,
    events,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch: removeMatch,
    saveVote,
    saveVoteSide,
    deleteVote,
    saveAttendance,
    deleteAttendance,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
  } = useMatchDetailPageData(matchId);

  const {
    activeTab,
    handleChangeTab,
    handleUpdateMatch,
    handleDeleteMatch,
    handleChangeRecordCompletion,
    handleChangePlayersPerSide,
    handleChangeRecordInclusion,
  } = useMatchDetailActions({
    match,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch: removeMatch,
  });

  if (!isLoaded) {
    return (
      <ContentState
        variant="loading"
        title="경기 정보를 불러오는 중..."
        description="경기 일정과 상세 기록을 준비하고 있어요."
      />
    );
  }

  if (pageError) {
    return (
      <ContentState
        variant="error"
        title="경기 정보를 불러오지 못했어요."
        description={pageError}
        action={
          <button
            type="button"
            onClick={() => void reloadPageData()}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            다시 시도
          </button>
        }
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

  if (!resolvedMatch || !matchDisplay) {
    return null;
  }

  const {
    displayScore,
    matchStatusLabel,
    matchSubText,
    opponentName,
    statusBadgeClassName,
  } = matchDisplay;

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
        <MatchVoteTab
          matchId={match.id}
          match={resolvedMatch}
          votes={matchVotes}
          saveVote={saveVote}
          deleteVote={deleteVote}
        />
      )}
      {activeTab === "attendance" && (
        <MatchAttendanceTab
          matchId={match.id}
          matchType={match.type}
          players={attendancePlayers}
          votes={matchVotes}
          attendance={matchAttendance}
          canManage={canManage}
          saveAttendance={saveAttendance}
          saveVoteSide={saveVoteSide}
          deleteAttendance={deleteAttendance}
        />
      )}

      {activeTab === "tactics" && (
        <MatchTacticsTab
          matchId={match.id}
          matchType={match.type}
          players={attendancePlayers}
          votes={matchVotes}
          sport={match.sport}
          playersPerSide={match.playersPerSide}
          quarterCount={match.quarterCount}
          onChangePlayersPerSide={handleChangePlayersPerSide}
          canManage={canManage}
        />
      )}

      {activeTab === "record" && (
        <MatchRecordTab
          votes={matchVotes}
          attendPlayers={attendancePlayers}
          matchType={match.type}
          countsTowardRecord={match.countsTowardRecord}
          onChangeRecordInclusion={handleChangeRecordInclusion}
          quarterCount={match.quarterCount}
          quarterDurationMinutes={match.quarterDurationMinutes}
          events={events}
          recordsLoaded={matchRecordsLoaded}
          recordCompletedAt={match.recordCompletedAt}
          hasMatchStarted={hasMatchStarted}
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
