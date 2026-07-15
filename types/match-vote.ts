export type VoteStatus = "attend" | "pending" | "absent" | "unvoted";

export interface MatchVote {
  playerId: string;
  status: VoteStatus;
}

export interface VoteMember {
  id: string;
  name: string;
  status: VoteStatus;
}

export type VoteFilter = "all" | VoteStatus;

export type MatchVotesByMatchId = Record<string, MatchVote[]>;
