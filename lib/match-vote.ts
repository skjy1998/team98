import { MatchVote, VoteFilter, VoteMember } from "@/types/match-vote";
import { PlayerType } from "@/types/player";

export function getVoteMembers(
  players: PlayerType[],
  currentVotes: MatchVote[],
): VoteMember[] {
  return players.map((player) => {
    const vote = currentVotes.find((item) => item.playerId === player.id);

    return {
      id: player.id,
      name: player.name,
      status: vote?.status ?? "pending",
    };
  });
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

  return {
    attend,
    pending,
    absent,
    total: voteMembers.length,
  };
}
