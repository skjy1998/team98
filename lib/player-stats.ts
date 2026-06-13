import { MatchVotesByMatchId } from "@/types/match-vote";
import { getIsUpcomingMatch } from "./match-ui";
import { MatchItem, MatchRecordMap } from "@/types/match";

export function getPastMatchIds(matches: MatchItem[]) {
  return matches
    .filter((match) => !getIsUpcomingMatch(match.date))
    .map((match) => match.id);
}

export function getPlayerAppearanceCount(
  playerId: string,
  pastMatchIds: string[],
  votes: MatchVotesByMatchId,
) {
  return pastMatchIds.reduce((count, matchId) => {
    const matchVotes = votes[matchId] ?? [];
    const attended = matchVotes.some(
      (vote) => vote.playerId === playerId && vote.status === "attend",
    );

    return attended ? count + 1 : count;
  }, 0);
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
