import type { MatchMvpVote, MatchMvpVotesByMatchId } from "@/types/match-mvp";
import { supabase } from "../supabase";

interface MatchMvpVoteRow {
  id: string;
  match_id: string;
  candidate_player_id: string;
  voter_user_id: string;
  created_at: string;
  updated_at: string;
}

const MATCH_MVP_VOTE_COLUMNS = `
  id,
  match_id,
  candidate_player_id,
  voter_user_id,
  created_at,
  updated_at
`;

function mapMatchMvpVote(row: MatchMvpVoteRow): MatchMvpVote {
  return {
    id: row.id,
    matchId: row.match_id,
    candidatePlayerId: row.candidate_player_id,
    voterUserId: row.voter_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function groupMatchMvpVotes(rows: MatchMvpVoteRow[]): MatchMvpVotesByMatchId {
  const votesByMatch: MatchMvpVotesByMatchId = {};

  for (const row of rows) {
    const vote = mapMatchMvpVote(row);
    const matchVotes = votesByMatch[row.match_id] ?? [];

    matchVotes.push(vote);
    votesByMatch[row.match_id] = matchVotes;
  }

  return votesByMatch;
}

export async function getTeamMatchMvpVotes(
  teamId: string,
): Promise<MatchMvpVotesByMatchId> {
  const { data, error } = await supabase
    .from("match_mvp_votes")
    .select(MATCH_MVP_VOTE_COLUMNS)
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return groupMatchMvpVotes((data ?? []) as MatchMvpVoteRow[]);
}

export async function upsertMatchMvpVote(
  teamId: string,
  matchId: string,
  candidatePlayerId: string,
): Promise<MatchMvpVote> {
  const { data, error } = await supabase
    .from("match_mvp_votes")
    .upsert(
      {
        team_id: teamId,
        match_id: matchId,
        candidate_player_id: candidatePlayerId,
      },
      {
        onConflict: "match_id,voter_user_id",
      },
    )
    .select(MATCH_MVP_VOTE_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapMatchMvpVote(data as MatchMvpVoteRow);
}

export async function removeMatchMvpVote(
  teamId: string,
  matchId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("match_mvp_votes")
    .delete()
    .eq("team_id", teamId)
    .eq("match_id", matchId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}
