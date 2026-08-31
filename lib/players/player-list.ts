// 선수 관리 페이지 표시 데이터, 검색, 정렬

import type { MatchItem, MatchRecordMap } from "@/types/match";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type { PlayerSortType, PlayerType } from "@/types/player";

import {
  getPlayerAppearanceCount,
  getPlayerAssistCount,
  getPlayerGoalCount,
} from "./player-stats";
import { getMainPositionFromDetail } from "./player-ui";
import { getHasMatchStarted } from "../matches/match-time";

export function getDisplayPlayers(
  players: PlayerType[],
  matches: MatchItem[],
  attendance: MatchAttendanceByMatchId,
  records: MatchRecordMap,
) {
  const pastMatches = matches.filter(
    (match) =>
      match.status !== "canceled" &&
      match.countsTowardRecord &&
      getHasMatchStarted(match.date, match.startTime),
  );

  const pastMatchIds = pastMatches.map((match) => match.id);

  return players.map((player) => ({
    ...player,
    appearance: getPlayerAppearanceCount(player.id, pastMatchIds, attendance),
    goal: getPlayerGoalCount(player.id, records, pastMatches),
    assist: getPlayerAssistCount(player.id, records, pastMatches),
  }));
}

export function getFilteredPlayers(
  players: PlayerType[],
  search: string,
  sortType: PlayerSortType,
) {
  const normalizedSearch = search.trim().toLocaleLowerCase("ko");

  const searchedPlayers = players.filter((player) =>
    player.name.toLocaleLowerCase("ko").includes(normalizedSearch),
  );

  if (sortType === "name") {
    return [...searchedPlayers].sort((a, b) =>
      a.name.localeCompare(b.name, "ko"),
    );
  }

  if (sortType === "number") {
    return [...searchedPlayers].sort((a, b) => {
      const aNumber = a.number ?? Number.MAX_SAFE_INTEGER;
      const bNumber = b.number ?? Number.MAX_SAFE_INTEGER;

      return aNumber - bNumber;
    });
  }

  if (sortType === "position") {
    const positionOrder = {
      GK: 0,
      DF: 1,
      MF: 2,
      FW: 3,
    } as const;

    return [...searchedPlayers].sort((a, b) => {
      const aPosition =
        getMainPositionFromDetail(a.detailPositions) ?? a.position;
      const bPosition =
        getMainPositionFromDetail(b.detailPositions) ?? b.position;

      const aRank = aPosition ? positionOrder[aPosition] : 99;
      const bRank = bPosition ? positionOrder[bPosition] : 99;

      if (aRank !== bRank) {
        return aRank - bRank;
      }

      return a.name.localeCompare(b.name, "ko");
    });
  }
  return [...searchedPlayers].reverse();
}
