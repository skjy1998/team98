import type { PlayerSortType, PlayerType } from "@/types/player";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { usePlayers } from "./usePlayers";
import { useMatches } from "../matches/useMatches";
import { useMatchAttendance } from "../matches/useMatchAttendance";
import useMatchRecordsMap from "../matches/useMatchRecordMap";
import { useConnectableTeamMembers } from "./useConnectableTeamMembers";
import {
  getDisplayPlayers,
  getFilteredPlayers,
} from "@/lib/players/player-list";
import { useMemo } from "react";
import { useMatchMvpVotes } from "../matches/useMatchMvpVotes";
import { getPlayerRecentMatches } from "@/lib/players/player-stats";
import { getHasMatchEnded } from "@/lib/matches/match-time";
import { getPlayerMvpWinCounts } from "@/lib/matches/match-mvp";
import { useFinanceSettings } from "../finance/useFinanceSettings";

interface UsePlayersPageDataParams {
  search: string;
  sortType: PlayerSortType;
  editingPlayer: PlayerType | null;
  viewingPlayerId: string | null;
}

export function usePlayersPageData({
  search,
  sortType,
  editingPlayer,
  viewingPlayerId,
}: Readonly<UsePlayersPageDataParams>) {
  const { team, teamLoaded, teamError, reloadTeam } = useCurrentTeam();
  const { canManage, memberLoaded, memberError, reloadMember } =
    useCurrentTeamMember();

  const {
    players,
    playersLoaded,
    playersError,
    addPlayer,
    deletePlayer,
    reloadPlayers,
  } = usePlayers();

  const { matches, matchesLoaded, matchesError, reloadMatches } = useMatches();

  const { attendance, attendanceLoaded, attendanceError, reloadAttendance } =
    useMatchAttendance();

  const { records, recordsLoaded, recordsError, reloadRecords } =
    useMatchRecordsMap();

  const { availableMembers, membersLoaded, membersError, reloadMembers } =
    useConnectableTeamMembers({
      teamId: canManage ? team?.id : undefined,
      players,
      editingPlayer,
    });

  const { mvpVotes, mvpVotesLoaded, mvpVotesError, reloadMvpVotes } =
    useMatchMvpVotes();

  const { feeTypes, settingsLoaded, settingsError, reloadSettings } =
    useFinanceSettings();

  const displayPlayers = useMemo(
    () => getDisplayPlayers(players, matches, attendance, records),
    [players, matches, attendance, records],
  );

  const filteredPlayers = useMemo(
    () => getFilteredPlayers(displayPlayers, search, sortType),
    [displayPlayers, search, sortType],
  );

  const profileRecentMatches = useMemo(
    () =>
      getPlayerRecentMatches(
        viewingPlayerId ?? undefined,
        matches,
        attendance,
        records,
        true,
      ),
    [viewingPlayerId, matches, attendance, records],
  );

  const profileMvpCount = useMemo(() => {
    if (!viewingPlayerId) return 0;

    const matchIds = matches
      .filter(
        (match) =>
          match.status !== "canceled" &&
          getHasMatchEnded(match.date, match.endTime),
      )
      .map((match) => match.id);

    const counts = getPlayerMvpWinCounts(
      matchIds,
      players,
      attendance,
      mvpVotes,
    );

    return counts[viewingPlayerId] ?? 0;
  }, [viewingPlayerId, matches, players, attendance, mvpVotes]);

  const isLoaded =
    teamLoaded &&
    playersLoaded &&
    matchesLoaded &&
    attendanceLoaded &&
    recordsLoaded &&
    memberLoaded &&
    mvpVotesLoaded &&
    membersLoaded &&
    settingsLoaded;

  const pageError =
    teamError ||
    memberError ||
    playersError ||
    matchesError ||
    attendanceError ||
    recordsError ||
    mvpVotesError ||
    settingsError ||
    membersError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadTeam(),
      reloadMember(),
      reloadPlayers(),
      reloadMatches(),
      reloadAttendance(),
      reloadRecords(),
      reloadMembers(),
      reloadMvpVotes(),
      reloadSettings(),
    ]);
  };

  return {
    teamId: team?.id,
    players,
    feeTypes,
    displayPlayers,
    filteredPlayers,
    availableMembers,
    canManage,
    isLoaded,
    pageError,
    addPlayer,
    deletePlayer,
    reloadPlayers,
    reloadPageData,
    profileRecentMatches,
    profileMvpCount,
  };
}
