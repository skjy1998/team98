import type {
  MatchVote,
  VoteFilter,
  VoteMember,
  VoteStatus,
  VoteSummary,
} from "@/types/match-vote";
import type { PlayerType } from "@/types/player";

export function getVoteMembers(
  players: PlayerType[],
  currentVotes: MatchVote[],
): VoteMember[] {
  const voteByPlayerId = new Map(
    currentVotes.map((vote) => [vote.playerId, vote]),
  );

  return players
    .map((player) => ({
      id: player.id,
      name: player.name,
      status: voteByPlayerId.get(player.id)?.status ?? "unvoted",
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name, "ko"));
}

export function getFilteredVoteMembers(
  voteMembers: VoteMember[],
  search: string,
  filter: VoteFilter,
): VoteMember[] {
  return voteMembers.filter((member) => {
    const matchSearch = member.name.includes(search);
    const matchFilter = filter === "all" ? true : member.status === filter;
    return matchSearch && matchFilter;
  });
}

export function getVoteSummary(voteMembers: VoteMember[]): VoteSummary {
  const summary = {
    attend: 0,
    pending: 0,
    absent: 0,
    unvoted: 0,
    total: voteMembers.length,
  };

  for (const member of voteMembers) {
    summary[member.status] += 1;
  }

  return summary;
}

export function formatVoteDeadline(voteDeadline: string) {
  const parsedDate = new Date(voteDeadline);

  if (Number.isNaN(parsedDate.getTime())) {
    return voteDeadline;
  }

  return parsedDate.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function isVoteClosed(voteDeadline: string) {
  const parsedDate = new Date(voteDeadline);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.getTime() < Date.now();
}

export function getPlayerVoteStatus(
  votes: MatchVote[],
  playerId?: string,
): VoteStatus {
  if (!playerId) return "unvoted";

  return votes.find((vote) => vote.playerId === playerId)?.status ?? "unvoted";
}

export function getAttendingPlayers(players: PlayerType[], votes: MatchVote[]) {
  const attendingPlayerIds = new Set(
    votes
      .filter((vote) => vote.status === "attend")
      .map((vote) => vote.playerId),
  );

  return players
    .filter((player) => attendingPlayerIds.has(player.id))
    .toSorted((a, b) => a.name.localeCompare(b.name, "ko"));
}
