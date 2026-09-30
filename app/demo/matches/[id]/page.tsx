"use client";

import DemoLink from "@/components/demo/DemoLink";
import DemoMatchTacticsTab from "@/components/demo/DemoMatchTacticsTab";
import { useDemoData } from "@/components/demo/DemoModeProvider";
import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";
import MatchAttendanceTab from "@/components/matches/detail/attendance/MatchAttendanceTab";
import { MatchInfoTab } from "@/components/matches/detail/info/MatchInfoTab";
import MatchMvpTab from "@/components/matches/detail/mvp/MatchMvpTab";
import MatchRecordTab from "@/components/matches/detail/record/MatchRecordTab";
import MatchVoteTab from "@/components/matches/detail/vote/MatchVoteTab";
import { getDisplayMatches } from "@/lib/matches/match-list-ui";
import { getHasMatchEnded, getHasMatchStarted } from "@/lib/matches/match-time";
import { getAttendingPlayers } from "@/lib/matches/match-vote";
import type { MatchDetailTab } from "@/types/match";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DemoMatchDetailPage() {
  const { id: matchId } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    players,
    matches,
    matchVotes,
    updateMatch,
    deleteMatch,
    saveVote,
    deleteVote,
    matchAttendance,
    saveVoteSide,
    saveAttendance,
    deleteAttendance,
    updateMatchPlayersPerSide,
    matchRecords,
    addRecordEvent,
    updateRecordEvent,
    deleteRecordEvent,
    reorderRecordEvents,
    setMatchRecordCompletion,
    updateMatchRecordInclusion,
    matchMvpVotes,
    saveMvpVote,
    deleteMvpVote,
  } = useDemoData();
  const [activeTab, setActiveTab] = useState<MatchDetailTab>("info");

  const displayMatches = getDisplayMatches(matches, matchRecords);
  const match = displayMatches.find((item) => item.id === matchId);
  const votes = matchVotes[matchId] ?? [];
  const attendancePlayers = getAttendingPlayers(players, votes);

  if (!match) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-stone-900">
          경기 정보를 찾을 수 없어요.
        </p>
        <DemoLink
          href="/matches"
          className="mt-4 inline-flex text-sm font-medium text-emerald-700"
        >
          일정 목록으로 돌아가기
        </DemoLink>
      </div>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `${match.title} 경기를 데모 목록에서 삭제할까요?`,
    );

    if (!confirmed) return;

    deleteMatch(match.id);
    router.push("/demo/matches");
  };

  return (
    <div className="space-y-6">
      <DemoLink
        href="/matches"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ChevronLeft className="h-4 w-4" />
        일정 목록
      </DemoLink>

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-sky-700 sm:px-4 sm:py-3">
        데모에서 수정한 경기 정보와 투표는 다른 데모 화면에서도 유지되며,
        새로고침하면 초기화됩니다.
      </div>

      <MatchDetailHeader match={match} teamName="스쿼드FC" />

      <MatchDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && (
        <MatchInfoTab
          match={match}
          matches={displayMatches}
          onSave={(value) => updateMatch(match.id, value)}
          onDelete={handleDelete}
          canManage
        />
      )}

      {activeTab === "vote" && (
        <MatchVoteTab
          matchId={match.id}
          match={match}
          players={players}
          currentUserId="demo-user"
          canManage
          votes={votes}
          saveVote={saveVote}
          deleteVote={deleteVote}
        />
      )}

      {activeTab === "attendance" && (
        <MatchAttendanceTab
          matchId={match.id}
          matchType={match.type}
          players={attendancePlayers}
          votes={votes}
          attendance={matchAttendance[match.id] ?? []}
          canManage
          saveVoteSide={saveVoteSide}
          saveAttendance={saveAttendance}
          deleteAttendance={deleteAttendance}
        />
      )}
      {activeTab === "tactics" && (
        <DemoMatchTacticsTab
          matchId={match.id}
          matchType={match.type}
          players={attendancePlayers}
          votes={votes}
          sport={match.sport}
          playersPerSide={match.playersPerSide}
          quarterCount={match.quarterCount}
          onChangePlayersPerSide={(playersPerSide) =>
            updateMatchPlayersPerSide(match.id, playersPerSide)
          }
        />
      )}

      {activeTab === "record" && (
        <MatchRecordTab
          votes={votes}
          attendPlayers={attendancePlayers}
          matchType={match.type}
          countsTowardRecord={match.countsTowardRecord}
          onChangeRecordInclusion={(countsTowardRecord) =>
            updateMatchRecordInclusion(match.id, countsTowardRecord)
          }
          quarterCount={match.quarterCount}
          quarterDurationMinutes={match.quarterDurationMinutes}
          events={matchRecords[match.id] ?? []}
          recordsLoaded
          recordCompletedAt={match.recordCompletedAt}
          hasMatchStarted={getHasMatchStarted(match.date, match.startTime)}
          addEvent={(type) => addRecordEvent(match.id, type)}
          deleteEvent={(eventId) => deleteRecordEvent(match.id, eventId)}
          updateEvent={(eventId, updates) =>
            updateRecordEvent(match.id, eventId, updates)
          }
          reorderEvents={(activeId, overId) =>
            reorderRecordEvents(match.id, activeId, overId)
          }
          onChangeCompletion={(completed) =>
            setMatchRecordCompletion(match.id, completed)
          }
          canManage
        />
      )}

      {activeTab === "mvp" && (
        <MatchMvpTab
          matchId={match.id}
          players={players}
          attendance={matchAttendance[match.id] ?? []}
          votes={matchMvpVotes[match.id] ?? []}
          currentUserId="demo-user"
          hasMatchEnded={getHasMatchEnded(match.date, match.endTime)}
          saveMvpVote={saveMvpVote}
          deleteMvpVote={deleteMvpVote}
          isCanceled={match.status === "canceled"}
        />
      )}
    </div>
  );
}
