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

interface UsePlayersPageDataParams {
  search: string;
  sortType: PlayerSortType;
  editingPlayer: PlayerType | null;
}

export function usePlayersPageData({
  search,
  sortType,
  editingPlayer,
}: Readonly<UsePlayersPageDataParams>) {
  const { team } = useCurrentTeam();
  const { canManage, memberLoaded } = useCurrentTeamMember();

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

  const displayPlayers = useMemo(
    () => getDisplayPlayers(players, matches, attendance, records),
    [players, matches, attendance, records],
  );

  const filteredPlayers = useMemo(
    () => getFilteredPlayers(displayPlayers, search, sortType),
    [displayPlayers, search, sortType],
  );

  const isLoaded =
    playersLoaded &&
    matchesLoaded &&
    attendanceLoaded &&
    recordsLoaded &&
    memberLoaded &&
    membersLoaded;

  const pageError =
    playersError ||
    matchesError ||
    attendanceError ||
    recordsError ||
    membersError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadPlayers(),
      reloadMatches(),
      reloadAttendance(),
      reloadRecords(),
      reloadMembers(),
    ]);
  };

  return {
    teamId: team?.id,
    players,
    filteredPlayers,
    availableMembers,
    canManage,
    isLoaded,
    pageError,
    addPlayer,
    deletePlayer,
    reloadPlayers,
    reloadPageData,
  };
}
