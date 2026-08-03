import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import { getIsUpcomingMatch } from "../matches/match-ui";
import { MatchItem, MatchRecordMap } from "@/types/match";
import { PlayerSortType, PlayerType } from "@/types/player";
import { getMainPositionFromDetail } from "./player-ui";
import { PlayerRecentMatch } from "@/types/stats";

export function getPlayerStats(
  players: PlayerType[],
  matches: MatchItem[],
  attendance: MatchAttendanceByMatchId,
  records: MatchRecordMap,
) {
  const validMatches = matches.filter((match) => match.status !== "canceled");
  const pastMatches = validMatches
    .filter((match) => !getIsUpcomingMatch(match.date))
    .sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime}`).getTime();

      return bTime - aTime;
    });

  const pastMatchIds = pastMatches.map((match) => match.id);

  return players.map((player) => {
    const { appearance, appearanceStreak, attendanceRate } =
      getPlayerAttendanceStats(player.id, pastMatchIds, attendance);

    const goal = getPlayerGoalCount(player.id, records, pastMatchIds);
    const assist = getPlayerAssistCount(player.id, records, pastMatchIds);
    const attackPoint = goal + assist;

    return {
      ...player,
      appearance,
      appearanceStreak,
      goal,
      assist,
      attackPoint,
      attendanceRate,
    };
  });
}

export function getPlayerRecentMatches(
  playerId: string | undefined,
  matches: MatchItem[],
  attendance: MatchAttendanceByMatchId,
  records: MatchRecordMap,
): PlayerRecentMatch[] {
  if (!playerId) return [];

  return matches
    .filter(
      (match) => match.status !== "canceled" && !getIsUpcomingMatch(match.date),
    )
    .sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime}`).getTime();

      return bTime - aTime;
    })
    .slice(0, 5)
    .map((match) => {
      const matchAttendance = attendance[match.id]?.find(
        (item) => item.playerId === playerId,
      );

      const matchRecords = records[match.id] ?? [];

      const goal = matchRecords.filter(
        (event) => event.type === "goal" && event.playerId === playerId,
      ).length;

      const assist = matchRecords.filter(
        (event) => event.type === "goal" && event.assistPlayerId === playerId,
      ).length;

      return {
        id: match.id,
        title: match.title,
        date: match.date,
        attendanceStatus: matchAttendance?.status ?? "unchecked",
        goal,
        assist,
      };
    });
}

export function getPastMatchIds(matches: MatchItem[]) {
  return matches
    .filter((match) => !getIsUpcomingMatch(match.date))
    .map((match) => match.id);
}

export function getIsAppearanceStatus(status: "attend" | "late" | "absent") {
  return status === "attend" || status === "late";
}

export function getPlayerAttendanceStats(
  playerId: string,
  matchIds: string[],
  attendance: MatchAttendanceByMatchId,
) {
  const attendanceRecords = matchIds
    .map((matchId) =>
      attendance[matchId]?.find((item) => item.playerId === playerId),
    )
    .filter((item) => item !== undefined);

  const appearance = attendanceRecords.filter((item) =>
    getIsAppearanceStatus(item.status),
  ).length;

  let appearanceStreak = 0;

  for (const record of attendanceRecords) {
    if (!getIsAppearanceStatus(record.status)) break;
    appearanceStreak += 1;
  }

  const attendanceRate =
    attendanceRecords.length > 0
      ? Math.round((appearance / attendanceRecords.length) * 100)
      : 0;

  return {
    appearance,
    appearanceStreak,
    attendanceRate,
  };
}

export function getPlayerAppearanceCount(
  playerId: string,
  pastMatchIds: string[],
  attendance: MatchAttendanceByMatchId,
) {
  return getPlayerAttendanceStats(playerId, pastMatchIds, attendance)
    .appearance;
}

export function getPlayerGoalCount(
  playerId: string,
  records: MatchRecordMap,
  validMatchIds: string[],
) {
  return validMatchIds.reduce((count, matchId) => {
    const events = records[matchId] ?? [];
    const goalCount = events.filter(
      (event) => event.type === "goal" && event.playerId === playerId,
    ).length;

    return count + goalCount;
  }, 0);
}

export function getPlayerAssistCount(
  playerId: string,
  records: MatchRecordMap,
  validMatchIds: string[],
) {
  return validMatchIds.reduce((count, matchId) => {
    const events = records[matchId] ?? [];
    const assistCount = events.filter(
      (event) => event.type === "goal" && event.assistPlayerId === playerId,
    ).length;

    return count + assistCount;
  }, 0);
}

// 선수 원본에 계산 스탯을 붙이는 역할
export function getDisplayPlayers(
  players: PlayerType[],
  matches: MatchItem[],
  attendance: MatchAttendanceByMatchId,
  records: MatchRecordMap,
) {
  const validMatches = matches.filter((match) => match.status !== "canceled");
  const pastMatchIds = getPastMatchIds(validMatches);

  return players.map((player) => ({
    ...player,
    appearance: getPlayerAppearanceCount(player.id, pastMatchIds, attendance),
    goal: getPlayerGoalCount(player.id, records, pastMatchIds),
    assist: getPlayerAssistCount(player.id, records, pastMatchIds),
  }));
}

// 검색 / 정렬 규칙을 공통 함수로 만드는 역할
export function getFilteredPlayers(
  players: PlayerType[],
  search: string,
  sortType: PlayerSortType,
) {
  const searchedPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase()),
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
        getMainPositionFromDetail(a.detailPositions) || a.position || "ZZZ";
      const bPosition =
        getMainPositionFromDetail(b.detailPositions) || b.position || "ZZZ";

      const aRank =
        aPosition in positionOrder
          ? positionOrder[aPosition as keyof typeof positionOrder]
          : 99;
      const bRank =
        bPosition in positionOrder
          ? positionOrder[bPosition as keyof typeof positionOrder]
          : 99;

      if (aRank !== bRank) {
        return aRank - bRank;
      }
      return a.name.localeCompare(b.name, "ko");
    });
  }
  return [...searchedPlayers].reverse();
}
