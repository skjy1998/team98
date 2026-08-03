import { getPlayerStats } from "../players/player-stats";
import type { RankingPlayer } from "@/types/stats";

export function getScorerRanking(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats].sort((a, b) => {
    if (b.goal !== a.goal) return b.goal - a.goal;
    return a.name.localeCompare(b.name, "ko");
  });
}

export function getAssisterRanking(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats].sort((a, b) => {
    if (b.assist !== a.assist) return b.assist - a.assist;
    return a.name.localeCompare(b.name, "ko");
  });
}

export function getAppearanceRanking(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats].sort((a, b) => {
    if (b.appearance !== a.appearance) {
      return b.appearance - a.appearance;
    }

    return a.name.localeCompare(b.name, "ko");
  });
}

export function getAppearanceStreakRanking(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return [...playerStats].sort((a, b) => {
    if (b.appearanceStreak !== a.appearanceStreak) {
      return b.appearanceStreak - a.appearanceStreak;
    }

    if (b.appearance !== a.appearance) {
      return b.appearance - a.appearance;
    }

    return a.name.localeCompare(b.name, "ko");
  });
}

export function getTopScorers(playerStats: ReturnType<typeof getPlayerStats>) {
  return getScorerRanking(playerStats).slice(0, 3);
}

export function getTopAssisters(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return getAssisterRanking(playerStats).slice(0, 3);
}

export function getTopAppearances(
  playerStats: ReturnType<typeof getPlayerStats>,
) {
  return getAppearanceRanking(playerStats).slice(0, 3);
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

export function getRankingItems(
  players: RankingPlayer[],
  key: "goal" | "assist" | "appearance" | "appearanceStreak",
) {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    value: player[key],
  }));
}

export function getPlayerRank(
  players: Array<{
    id: string;
    goal: number;
    assist: number;
    appearance: number;
  }>,
  playerId: string | undefined,
  key: "goal" | "assist" | "appearance",
) {
  if (!playerId) return null;

  const player = players.find((item) => item.id === playerId);
  if (!player || player[key] === 0) {
    return null;
  }

  const higherPlayerCount = players.filter(
    (item) => item[key] > player[key],
  ).length;

  return higherPlayerCount + 1;
}
