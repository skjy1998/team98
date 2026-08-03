import { getIsUpcomingMatch } from "@/lib/matches/match-ui";
import type { MatchItem, MatchRecordMap } from "@/types/match";
import type { RecentResult, TeamHighlights } from "@/types/stats";

export function getMatchScoreFromEvent(
  records: MatchRecordMap,
  matchId: string,
) {
  const events = records[matchId] ?? [];
  const goals = events.filter((event) => event.type === "goal").length;
  const conceded = events.filter((event) => event.type === "concede").length;

  return { goals, conceded };
}

function hasRecordEvents(records: MatchRecordMap, matchId: string) {
  const events = records[matchId] ?? [];
  return events.length > 0;
}

function hasSavedScore(match: MatchItem) {
  return match.ourScore !== undefined && match.opponentScore !== undefined;
}

function isCompletedMatch(match: MatchItem, records: MatchRecordMap) {
  return (
    match.status !== "canceled" &&
    !getIsUpcomingMatch(match.date) &&
    (hasSavedScore(match) || hasRecordEvents(records, match.id))
  );
}

function getMatchScore(match: MatchItem, records: MatchRecordMap) {
  if (hasSavedScore(match)) {
    return {
      goals: match.ourScore ?? 0,
      conceded: match.opponentScore ?? 0,
    };
  }

  return getMatchScoreFromEvent(records, match.id);
}

// 최근 5경기 결과
export function getRecentResults(
  matches: MatchItem[],
  records: MatchRecordMap,
): RecentResult[] {
  const completedMatches = matches
    .filter((match) => isCompletedMatch(match, records))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return completedMatches.slice(-5).map((match) => {
    const { goals, conceded } = getMatchScore(match, records);

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

  const completedMatches = matches.filter((match) =>
    isCompletedMatch(match, records),
  );

  completedMatches.forEach((match) => {
    const { goals, conceded } = getMatchScore(match, records);
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

export function getTeamHighlights(
  matches: MatchItem[],
  records: MatchRecordMap,
): TeamHighlights {
  const completedMatches = matches
    .filter((match) => isCompletedMatch(match, records))
    .map((match) => {
      const { goals, conceded } = getMatchScore(match, records);

      return {
        id: match.id,
        title: match.title,
        date: match.date,
        startTime: match.startTime,
        goals,
        conceded,
      };
    });

  const highestScoringMatch = completedMatches.reduce<
    (typeof completedMatches)[number] | null
  >((best, match) => {
    if (!best || match.goals > best.goals) return match;
    return best;
  }, null);

  const biggestWin = completedMatches.reduce<
    (typeof completedMatches)[number] | null
  >((best, match) => {
    const goalDifference = match.goals - match.conceded;
    if (goalDifference <= 0) return best;

    if (!best) return match;

    const bestGoalDifference = best.goals - best.conceded;
    return goalDifference > bestGoalDifference ? match : best;
  }, null);

  const cleanSheetCount = completedMatches.filter(
    (match) => match.conceded === 0,
  ).length;

  const latestMatches = [...completedMatches].sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
    const bTime = new Date(`${b.date}T${b.startTime}`).getTime();

    return bTime - aTime;
  });

  let currentUnbeatenStreak = 0;

  for (const match of latestMatches) {
    if (match.goals < match.conceded) break;
    currentUnbeatenStreak += 1;
  }

  return {
    highestScoringMatch,
    biggestWin,
    cleanSheetCount,
    currentUnbeatenStreak,
  };
}
