import { useMemo } from "react";
import { usePlayers } from "../players/usePlayers";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useMatchAttendance } from "./useMatchAttendance";
import { useMatches } from "./useMatches";
import useMatchRecordsMap from "./useMatchRecordMap";
import { useMatchRecords } from "./useMatchRecords";
import { useMatchVotes } from "./useMatchVotes";
import { getHasMatchStarted } from "@/lib/matches/match-time";
import { getDisplayMatches } from "@/lib/matches/match-list-ui";
import {
  getMatchDetailDisplay,
  getMatchWithRecordScore,
} from "@/lib/matches/match-detail-ui";
import { getAttendingPlayers } from "@/lib/matches/match-vote";

export type MatchDetailPageData = ReturnType<typeof useMatchDetailPageData>;

export function useMatchDetailPageData(matchId: string) {
  const {
    matches,
    matchesLoaded,
    matchesError,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch,
    reloadMatches,
  } = useMatches({ includeAllSeasons: true });

  const {
    records,
    recordsLoaded: recordsMapLoaded,
    recordsError: recordsMapError,
    reloadRecords: reloadRecordsMap,
  } = useMatchRecordsMap();

  const {
    votes,
    votesLoaded,
    votesError,
    saveVote,
    saveVoteSide,
    deleteVote,
    reloadVotes,
  } = useMatchVotes();

  const {
    attendance,
    attendanceLoaded,
    attendanceError,
    saveAttendance,
    deleteAttendance,
    reloadAttendance,
  } = useMatchAttendance();

  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();
  const { team, teamLoaded, teamError, reloadTeam } = useCurrentTeam();
  const { member, canManage, memberLoaded, memberError, reloadMember } =
    useCurrentTeamMember();

  const match = matches.find((item) => item.id === matchId);
  const targetMatchId = match?.id ?? "";

  const {
    loaded: matchRecordsLoaded,
    recordsError,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
    reloadRecords: reloadMatchRecords,
  } = useMatchRecords(targetMatchId);

  const matchVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);

  const matchAttendance = useMemo(
    () => attendance[matchId] ?? [],
    [attendance, matchId],
  );

  const attendancePlayers = useMemo(
    () => getAttendingPlayers(players, matchVotes),
    [players, matchVotes],
  );

  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );

  const resolvedMatch = match
    ? getMatchWithRecordScore(
        match,
        matchRecordsLoaded,
        events,
        ourScore,
        opponentScore,
      )
    : undefined;

  const matchDisplay = resolvedMatch
    ? getMatchDetailDisplay(resolvedMatch)
    : null;

  const hasMatchStarted = match
    ? getHasMatchStarted(match.date, match.startTime)
    : false;

  const isLoaded =
    teamLoaded &&
    matchesLoaded &&
    recordsMapLoaded &&
    matchRecordsLoaded &&
    memberLoaded &&
    votesLoaded &&
    playersLoaded &&
    attendanceLoaded;

  const pageError =
    teamError ||
    matchesError ||
    recordsMapError ||
    votesError ||
    attendanceError ||
    playersError ||
    memberError ||
    recordsError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadTeam(),
      reloadMatches(),
      reloadRecordsMap(),
      reloadVotes(),
      reloadAttendance(),
      reloadPlayers(),
      reloadMember(),
      reloadMatchRecords(),
    ]);
  };

  return {
    team,
    canManage,
    players,
    currentUserId: member?.userId,

    isLoaded,
    pageError,

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
    deleteMatch,

    saveVote,
    saveVoteSide,
    deleteVote,

    saveAttendance,
    deleteAttendance,

    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,

    reloadPageData,
  };
}
