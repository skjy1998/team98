import { MatchItem, MatchRecordMap } from "@/types/match";
import { getIsUpcomingMatch } from "./match-ui";
import { PlayerType } from "@/types/player";
import { MatchVotesByMatchId } from "@/types/match-vote";
import {
  getPastMatchIds,
  getPlayerAppearanceCount,
  getPlayerAssistCount,
  getPlayerGoalCount,
} from "./player-stats";

// 점수 계산 helper
export function getMatchScoreFromEvent(
  records: MatchRecordMap,
  matchId: string,
) {
  const events = records[matchId] ?? [];
  const goals = events.filter((event) => event.type === "goal").length;
  const conceded = events.filter((event) => event.type === "concede").length;

  return { goals, conceded };
}

// 최근 5경기 결과
export function getRecentResults(
  matches: MatchItem[],
  records: MatchRecordMap,
) {
  const pastMatches = matches
    .filter((match) => !getIsUpcomingMatch(match.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return pastMatches.slice(-5).map((match) => {
    const { goals, conceded } = getMatchScoreFromEvent(records, match.id);

    if (goals > conceded) return "win" as const;
    if (goals < conceded) return "lose" as const;
    return "draw" as const;
  });
}

// 팀 전적
export function getTeamSummary(matches: MatchItem[], records: MatchRecordMap) {
  const summary = {
    total: 0,
    win: 0,
    draw: 0,
    lose: 0,
    goals: 0,
    conceded: 0,
  };

  const pastMatches = matches.filter(
    (match) => !getIsUpcomingMatch(match.date),
  );

  pastMatches.forEach((match) => {
    const { goals, conceded } = getMatchScoreFromEvent(records, match.id);

    summary.total += 1;
    summary.goals += goals;
    summary.conceded += conceded;

    if (goals > conceded) {
      summary.win += 1;
    } else if (goals < conceded) {
      summary.lose += 1;
    } else {
      summary.draw += 1;
    }
  });

  const winRate =
    summary.total > 0 ? Math.round((summary.win / summary.total) * 100) : 0;

  return {
    ...summary,
    winRate,
    goalDiff: summary.goals - summary.conceded,
  };
}

// 선수 통계
export function getPlayerStats(
  players: PlayerType[],
  matches: MatchItem[],
  votes: MatchVotesByMatchId,
  records: MatchRecordMap,
) {
  const pastMatchIds = getPastMatchIds(matches);
  const matchIds = matches.map((match) => match.id);

  return players.map((player) => {
    const appearance = getPlayerAppearanceCount(player.id, pastMatchIds, votes);
    const goal = getPlayerGoalCount(player.id, records, matchIds);
    const assist = getPlayerAssistCount(player.id, records, matchIds);
    const attackPoint = goal + assist;

    const attendCount = matchIds.reduce((count, matchId) => {
      const matchVotes = votes[matchId] ?? [];
      const attended = matchVotes.some(
        (vote) => vote.playerId === player.id && vote.status === "attend",
      );

      return attended ? count + 1 : count;
    }, 0);

    const attendanceRate =
      matchIds.length > 0
        ? Math.round((attendCount / matchIds.length) * 100)
        : 0;

    return {
      ...player,
      appearance,
      goal,
      assist,
      attackPoint,
      attendanceRate,
    };
  });
}

// 정렬 helper

export function getTopScorers(playerStats: ReturnType<typeof getPlayerStats>) {
  return [...playerStats]
    .sort((a, b) => {
      if (b.goal !== a.goal) return b.goal - a.goal;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 3);
}

export function getTopAssisters(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats]
    .sort((a, b) => {
      if (b.assist !== a.assist) return b.assist - a.assist;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 3);
}

export function getTopAppearances(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats]
    .sort((a, b) => {
      if (b.appearance !== a.appearance) return b.appearance - a.appearance;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 3);
}

export function getRankPlayerStats(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats].sort((a, b) => {
    if (b.attackPoint !== a.attackPoint) return b.attackPoint - a.attackPoint;
    if (b.goal !== a.goal) return b.goal - a.goal;
    if (b.assist !== a.assist) return b.assist - a.assist;
    return a.name.localeCompare(b.name, "ko");
  });
}
