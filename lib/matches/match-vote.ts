import type {
  MatchVote,
  VoteFilter,
  VoteMember,
  VoteStatus,
} from "@/types/match-vote";
import { PlayerType } from "@/types/player";

export function getVoteMembers(
  players: PlayerType[],
  currentVotes: MatchVote[],
): VoteMember[] {
  return players
    .map((player) => {
      const vote = currentVotes.find((item) => item.playerId === player.id);

      return {
        id: player.id,
        name: player.name,
        status: vote?.status ?? "unvoted",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
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

export function getVoteSummary(voteMembers: VoteMember[]) {
  const attend = voteMembers.filter(
    (member) => member.status === "attend",
  ).length;
  const pending = voteMembers.filter(
    (member) => member.status === "pending",
  ).length;
  const absent = voteMembers.filter(
    (member) => member.status === "absent",
  ).length;
  const unvoted = voteMembers.filter(
    (member) => member.status === "unvoted",
  ).length;

  return {
    attend,
    pending,
    absent,
    unvoted,
    total: voteMembers.length,
  };
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
