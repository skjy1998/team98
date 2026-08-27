// 출전, 득점, 도움, 연속 출전 등 통계 계산

import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type {
  MatchItem,
  MatchRecordEvent,
  MatchRecordMap,
} from "@/types/match";
import type { PlayerType } from "@/types/player";
import type { PlayerRecentMatch } from "@/types/stats";
import { getHasMatchStarted } from "../matches/match-ui";

function isPlayerScoringEvent(event: MatchRecordEvent, match: MatchItem) {
  return (
    event.type === "goal" ||
    (match.type === "자체전" && event.type === "concede")
  );
}

export function getPlayerStats(
  players: PlayerType[],
  matches: MatchItem[],
  attendance: MatchAttendanceByMatchId,
  records: MatchRecordMap,
) {
  const validMatches = matches.filter(
    (match) => match.status !== "canceled" && match.countsTowardRecord,
  );
  const pastMatches = validMatches
    .filter((match) => getHasMatchStarted(match.date, match.startTime))
    .sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
      const bTime = new Date(`${b.date}T${b.startTime}`).getTime();

      return bTime - aTime;
    });

  const pastMatchIds = pastMatches.map((match) => match.id);

  return players.map((player) => {
    const { appearance, appearanceStreak, attendanceRate } =
      getPlayerAttendanceStats(player.id, pastMatchIds, attendance);

    const goal = getPlayerGoalCount(player.id, records, pastMatches);
    const assist = getPlayerAssistCount(player.id, records, pastMatches);
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
      (match) =>
        match.status !== "canceled" &&
        match.countsTowardRecord &&
        getHasMatchStarted(match.date, match.startTime),
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
        (event) =>
          isPlayerScoringEvent(event, match) && event.playerId === playerId,
      ).length;

      const assist = matchRecords.filter(
        (event) =>
          isPlayerScoringEvent(event, match) &&
          event.assistPlayerId === playerId,
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
    .filter((match) => getHasMatchStarted(match.date, match.startTime))
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
  validMatches: MatchItem[],
) {
  return validMatches.reduce((count, match) => {
    const events = records[match.id] ?? [];

    return (
      count +
      events.filter(
        (event) =>
          isPlayerScoringEvent(event, match) && event.playerId === playerId,
      ).length
    );
  }, 0);
}

export function getPlayerAssistCount(
  playerId: string,
  records: MatchRecordMap,
  validMatches: MatchItem[],
) {
  return validMatches.reduce((count, match) => {
    const events = records[match.id] ?? [];

    return (
      count +
      events.filter(
        (event) =>
          isPlayerScoringEvent(event, match) &&
          event.assistPlayerId === playerId,
      ).length
    );
  }, 0);
}
