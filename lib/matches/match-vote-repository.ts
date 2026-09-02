import type { SelfMatchSide } from "@/types/match";
import type { MatchVotesByMatchId, VoteStatus } from "@/types/match-vote";
import { supabase } from "../supabase";

interface MatchVoteRow {
  match_id: string;
  player_id: string;
  status: VoteStatus;
  side: SelfMatchSide | null;
}

function groupVotesByMatch(rows: MatchVoteRow[]): MatchVotesByMatchId {
  return rows.reduce<MatchVotesByMatchId>((voteMap, row) => {
    const matchVotes = voteMap[row.match_id] ?? [];

    return {
      ...voteMap,
      [row.match_id]: [
        ...matchVotes,
        {
          playerId: row.player_id,
          status: row.status,
          side: row.side ?? undefined,
        },
      ],
    };
  }, {});
}

export async function getTeamMatchVotes(
  teamId: string,
): Promise<MatchVotesByMatchId> {
  const { data, error } = await supabase
    .from("match_votes")
    .select("match_id, player_id, status, side")
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return groupVotesByMatch((data ?? []) as MatchVoteRow[]);
}

export async function upsertTeamMatchVote(
  teamId: string,
  matchId: string,
  playerId: string,
  status: VoteStatus,
  side: SelfMatchSide | null,
): Promise<void> {
  const { error } = await supabase.from("match_votes").upsert(
    {
      team_id: teamId,
      match_id: matchId,
      player_id: playerId,
      status,
      side,
    },
    {
      onConflict: "match_id,player_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function updateSelfMatchPlayerSide(
  matchId: string,
  playerId: string,
  side: SelfMatchSide | null,
): Promise<void> {
  const { data, error } = await supabase.rpc("set_self_match_player_side", {
    p_match_id: matchId,
    p_player_id: playerId,
    p_side: side,
  });

  if (error) {
    throw error;
  }

  if (data !== true) {
    throw new Error("자체전 팀 배정에 실패했어요.");
  }
}

export async function removeTeamMatchVote(
  teamId: string,
  matchId: string,
  playerId: string,
) {
  const { data, error } = await supabase
    .from("match_votes")
    .delete()
    .eq("team_id", teamId)
    .eq("match_id", matchId)
    .eq("player_id", playerId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}
