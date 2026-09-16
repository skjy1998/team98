export interface MatchMvpVote {
  id: string;
  matchId: string;
  candidatePlayerId: string;
  voterUserId: string;
  createdAt: string;
  updatedAt: string;
}

export type MatchMvpVotesByMatchId = Record<string, MatchMvpVote[]>;

export interface MatchMvpCandidate {
  playerId: string;
  playerName: string;
  voteCount: number;
  isWinner: boolean;
}

export interface MatchMvpSummary {
  candidates: MatchMvpCandidate[];
  totalVotes: number;
  winnerIds: string[];
}
