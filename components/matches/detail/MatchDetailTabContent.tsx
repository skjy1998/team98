import type { MatchItem } from "@/types/match";
import { MatchInfoTab } from "./info/MatchInfoTab";
import MatchVoteTab from "./vote/MatchVoteTab";
import type { MatchDetailPageData } from "@/hooks/matches/useMatchDetailPageData";
import type { MatchDetailActions } from "@/hooks/matches/useMatchDetailActions";
import MatchAttendanceTab from "./attendance/MatchAttendanceTab";
import MatchTacticsTab from "./tactics/MatchTacticsTab";
import MatchRecordTab from "./record/MatchRecordTab";
import MatchMvpTab from "./mvp/MatchMvpTab";

interface MatchDetailTabContentProps {
  match: MatchItem;
  data: MatchDetailPageData;
  actions: MatchDetailActions;
}

export default function MatchDetailTabContent({
  match,
  data,
  actions,
}: Readonly<MatchDetailTabContentProps>) {
  if (actions.activeTab === "info") {
    return (
      <MatchInfoTab
        match={match}
        matches={data.displayMatches}
        onSave={actions.handleUpdateMatch}
        onDelete={actions.handleDeleteMatch}
        canManage={data.canManage}
      />
    );
  }

  if (actions.activeTab === "vote") {
    return (
      <MatchVoteTab
        matchId={match.id}
        match={match}
        players={data.players}
        currentUserId={data.currentUserId}
        canManage={data.canManage}
        votes={data.matchVotes}
        saveVote={data.saveVote}
        deleteVote={data.deleteVote}
      />
    );
  }

  if (actions.activeTab === "attendance") {
    return (
      <MatchAttendanceTab
        matchId={match.id}
        matchType={match.type}
        players={data.attendancePlayers}
        votes={data.matchVotes}
        attendance={data.matchAttendance}
        canManage={data.canManage}
        saveAttendance={data.saveAttendance}
        saveVoteSide={data.saveVoteSide}
        deleteAttendance={data.deleteAttendance}
      />
    );
  }

  if (actions.activeTab === "tactics") {
    return (
      <MatchTacticsTab
        matchId={match.id}
        matchType={match.type}
        players={data.attendancePlayers}
        votes={data.matchVotes}
        sport={match.sport}
        playersPerSide={match.playersPerSide}
        quarterCount={match.quarterCount}
        onChangePlayersPerSide={actions.handleChangePlayersPerSide}
        canManage={data.canManage}
      />
    );
  }

  if (actions.activeTab === "record") {
    return (
      <MatchRecordTab
        votes={data.matchVotes}
        attendPlayers={data.attendancePlayers}
        matchType={match.type}
        countsTowardRecord={match.countsTowardRecord}
        onChangeRecordInclusion={actions.handleChangeRecordInclusion}
        quarterCount={match.quarterCount}
        quarterDurationMinutes={match.quarterDurationMinutes}
        events={data.events}
        recordsLoaded={data.matchRecordsLoaded}
        recordCompletedAt={match.recordCompletedAt}
        hasMatchStarted={data.hasMatchStarted}
        addEvent={data.addEvent}
        deleteEvent={data.deleteEvent}
        updateEvent={data.updateEvent}
        reorderEvents={data.reorderEvents}
        onChangeCompletion={actions.handleChangeRecordCompletion}
        canManage={data.canManage}
      />
    );
  }

  if (actions.activeTab === "mvp") {
    return (
      <MatchMvpTab
        matchId={match.id}
        players={data.players}
        attendance={data.matchAttendance}
        votes={data.matchMvpVotes}
        currentUserId={data.currentUserId}
        hasMatchEnded={data.hasMatchEnded}
        saveMvpVote={data.saveMvpVote}
        deleteMvpVote={data.deleteMvpVote}
        isCanceled={match.status === "canceled"}
      />
    );
  }

  return null;
}
