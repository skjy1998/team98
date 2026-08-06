import type { MatchItem } from "@/types/match";
import { getIsUpcomingMatch } from "../matches/match-ui";

function getMatchTime(match: MatchItem) {
  return new Date(`${match.date}T${match.startTime}`).getTime();
}

export function getDashboardUpcomingMatches(matches: MatchItem[]) {
  return [...matches]
    .filter(
      (match) => match.status !== "canceled" && getIsUpcomingMatch(match.date),
    )
    .sort((a, b) => getMatchTime(a) - getMatchTime(b));
}

export function getDashboardRecentMatch(matches: MatchItem[]) {
  return [...matches]
    .filter(
      (match) =>
        match.status !== "canceled" &&
        !getIsUpcomingMatch(match.date) &&
        match.ourScore !== undefined &&
        match.opponentScore !== undefined,
    )
    .sort((a, b) => getMatchTime(b) - getMatchTime(a))[0];
}
