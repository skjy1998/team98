// 경기 목록 계산
import type { MatchItem, MatchRecordMap } from "@/types/match";
import { getMatchResult, getMatchScoreText } from "./match-display";
import { getHasMatchStarted, getIsUpcomingMatch } from "./match-time";

export function getMatchValueText(match: MatchItem) {
  const result = getMatchResult(match);

  if (result !== "scheduled") {
    return getMatchScoreText(match) ?? "";
  }

  return match.isUpcoming ? "경기 전" : "기록 전";
}

export function shouldShowMatchStatusBadge(match: MatchItem) {
  const result = getMatchResult(match);

  return result !== "scheduled" || match.isUpcoming;
}

export function getDisplayMatches(
  matches: MatchItem[],
  records: MatchRecordMap,
) {
  return matches.map((match) => {
    const events = records[match.id] ?? [];
    const isUpcoming = getIsUpcomingMatch(match.date, match.startTime);

    if (events.length === 0) {
      return {
        ...match,
        isUpcoming,
        ...(match.recordCompletedAt
          ? {
              ourScore: 0,
              opponentScore: 0,
            }
          : {}),
      };
    }

    const ourScore = events.filter((event) => event.type === "goal").length;

    const opponentScore = events.filter(
      (event) => event.type === "concede",
    ).length;

    return {
      ...match,
      ourScore,
      opponentScore,
      isUpcoming,
    };
  });
}

function getMatchDateTime(match: MatchItem) {
  return new Date(`${match.date}T${match.startTime}`).getTime();
}

export function getMatchListData(
  matches: MatchItem[],
  records: MatchRecordMap,
) {
  const displayMatches = getDisplayMatches(matches, records);

  const upcomingMatches = displayMatches
    .filter(
      (match) =>
        match.status !== "canceled" &&
        !getHasMatchStarted(match.date, match.startTime),
    )
    .toSorted((a, b) => getMatchDateTime(a) - getMatchDateTime(b));

  const pastMatches = displayMatches
    .filter(
      (match) =>
        match.status === "canceled" ||
        getHasMatchStarted(match.date, match.startTime),
    )
    .toSorted((a, b) => getMatchDateTime(b) - getMatchDateTime(a));

  return {
    displayMatches,
    upcomingMatches,
    pastMatches,
  };
}
