import { MatchVotesByMatchId } from "@/types/match-vote";
import { getIsUpcomingMatch } from "../matches/match-ui";
import { MatchItem, MatchRecordMap } from "@/types/match";
import { PlayerSortType, PlayerType } from "@/types/player";
import { getMainPositionFromDetail } from "./player-ui";

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

// 선수 원본에 계산 스탯을 붙이는 역할
export function getDisplayPlayers(
  players: PlayerType[],
  matches: MatchItem[],
  votes: MatchVotesByMatchId,
  records: MatchRecordMap,
) {
  const pastMatchIds = getPastMatchIds(matches);
  const matchIds = matches.map((match) => match.id);

  return players.map((player) => ({
    ...player,
    appearance: getPlayerAppearanceCount(player.id, pastMatchIds, votes),
    goal: getPlayerGoalCount(player.id, records, matchIds),
    assist: getPlayerAssistCount(player.id, records, matchIds),
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
