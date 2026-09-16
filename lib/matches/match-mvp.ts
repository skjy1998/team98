import type {
  MatchAttendance,
  MatchAttendanceByMatchId,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type {
  MatchMvpSummary,
  MatchMvpVote,
  MatchMvpVotesByMatchId,
} from "@/types/match-mvp";
import type { PlayerType } from "@/types/player";

const MVP_ELIGIBLE_ATTENDANCE_STATUSES = new Set<MatchAttendanceStatus>([
  "attend",
  "late",
]);

function getEligiblePlayerIds(attendance: MatchAttendance[]) {
  return new Set(
    attendance
      .filter((item) => MVP_ELIGIBLE_ATTENDANCE_STATUSES.has(item.status))
      .map((item) => item.playerId),
  );
}

export function canUserVoteForMatchMvp(
  players: PlayerType[],
  attendance: MatchAttendance[],
  currentUserId?: string,
) {
  if (!currentUserId) return false;

  const currentPlayer = players.find(
    (player) => player.userId === currentUserId,
  );

  if (!currentPlayer) return false;

  return getEligiblePlayerIds(attendance).has(currentPlayer.id);
}

export function getCurrentUserMvpVote(
  votes: MatchMvpVote[],
  currentUserId?: string,
) {
  if (!currentUserId) return undefined;

  return votes.find((vote) => vote.voterUserId === currentUserId);
}

export function getMatchMvpSummary(
  players: PlayerType[],
  attendance: MatchAttendance[],
  votes: MatchMvpVote[],
): MatchMvpSummary {
  const eligiblePlayerIds = getEligiblePlayerIds(attendance);
  const playerById = new Map(players.map((player) => [player.id, player]));
  const eligibleVoterUserIds = new Set(
    players
      .filter((player) => eligiblePlayerIds.has(player.id) && player.userId)
      .map((player) => player.userId),
  );
  const voteCountByPlayerId = new Map<string, number>();

  for (const vote of votes) {
    if (
      !eligibleVoterUserIds.has(vote.voterUserId) ||
      !eligiblePlayerIds.has(vote.candidatePlayerId) ||
      !playerById.has(vote.candidatePlayerId)
    ) {
      continue;
    }

    const currentCount = voteCountByPlayerId.get(vote.candidatePlayerId) ?? 0;

    voteCountByPlayerId.set(vote.candidatePlayerId, currentCount + 1);
  }

  const candidates = players
    .filter((player) => eligiblePlayerIds.has(player.id))
    .map((player) => ({
      playerId: player.id,
      playerName: player.name,
      voteCount: voteCountByPlayerId.get(player.id) ?? 0,
    }))
    .toSorted(
      (a, b) =>
        b.voteCount - a.voteCount ||
        a.playerName.localeCompare(b.playerName, "ko"),
    );

  const topVoteCount = candidates[0]?.voteCount ?? 0;

  const winnerIds =
    topVoteCount > 0
      ? candidates
          .filter((candidate) => candidate.voteCount === topVoteCount)
          .map((candidate) => candidate.playerId)
      : [];

  return {
    candidates: candidates.map((candidate) => ({
      ...candidate,
      isWinner: winnerIds.includes(candidate.playerId),
    })),
    totalVotes: candidates.reduce(
      (total, candidate) => total + candidate.voteCount,
      0,
    ),
    winnerIds,
  };
}

export function getPlayerMvpWinCounts(
  matchIds: string[],
  players: PlayerType[],
  attendance: MatchAttendanceByMatchId,
  votes: MatchMvpVotesByMatchId,
) {
  const winCounts: Record<string, number> = {};

  for (const matchId of matchIds) {
    const summary = getMatchMvpSummary(
      players,
      attendance[matchId] ?? [],
      votes[matchId] ?? [],
    );

    for (const winnerId of summary.winnerIds) {
      winCounts[winnerId] = (winCounts[winnerId] ?? 0) + 1;
    }
  }

  return winCounts;
}
