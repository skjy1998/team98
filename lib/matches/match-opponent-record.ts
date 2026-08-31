// 상대 전적
import type {
  MatchItem,
  MatchOpponentRecordItem,
  MatchOpponentRecordSummary,
} from "@/types/match";

export function getOpponentRecordSummary(
  matches: MatchItem[],
  opponent: string,
  currentMatchId: string,
): MatchOpponentRecordSummary {
  const opponentMatches = matches
    .filter(
      (match) =>
        match.id !== currentMatchId &&
        match.countsTowardRecord &&
        match.type === "정규" &&
        match.opponent === opponent &&
        match.ourScore !== undefined &&
        match.opponentScore !== undefined,
    )
    .toSorted((a, b) => b.date.localeCompare(a.date));

  const summary = opponentMatches.reduce(
    (acc, match) => {
      const ourScore = match.ourScore ?? 0;
      const opponentScore = match.opponentScore ?? 0;

      acc.totalMatches += 1;
      acc.goals += ourScore;
      acc.conceded += opponentScore;

      if (ourScore > opponentScore) {
        acc.win += 1;
      } else if (ourScore < opponentScore) {
        acc.lose += 1;
      } else {
        acc.draw += 1;
      }

      return acc;
    },
    {
      totalMatches: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: 0,
      conceded: 0,
    },
  );

  const recentMatches: MatchOpponentRecordItem[] = opponentMatches
    .slice(0, 5)
    .map((match) => {
      const ourScore = match.ourScore ?? 0;
      const opponentScore = match.opponentScore ?? 0;

      const result: MatchOpponentRecordItem["result"] =
        ourScore > opponentScore
          ? "win"
          : ourScore < opponentScore
            ? "lose"
            : "draw";

      return {
        id: match.id,
        date: match.date,
        ourScore,
        opponentScore,
        result,
      };
    });

  const goalDiff = summary.goals - summary.conceded;

  const winRate =
    summary.totalMatches === 0
      ? 0
      : Math.round((summary.win / summary.totalMatches) * 100);

  return {
    ...summary,
    goalDiff,
    winRate,
    recentMatches,
  };
}
