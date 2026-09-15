import type { SelfMatchSide } from "./match";

export type VoteStatus = "attend" | "pending" | "absent" | "unvoted";

export interface MatchVote {
  playerId: string;
  status: VoteStatus;
  side?: SelfMatchSide;
}

export interface VoteMember {
  id: string;
  name: string;
  status: VoteStatus;
}

export interface VoteSummary {
  attend: number;
  pending: number;
  absent: number;
  unvoted: number;
  total: number;
}

export type VoteFilter = "all" | VoteStatus;

export type MatchVotesByMatchId = Record<string, MatchVote[]>;
