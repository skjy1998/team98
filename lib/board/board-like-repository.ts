import type { TeamPostLike } from "@/types/board";
import { supabase } from "../supabase";

interface TeamPostLikeRow {
  post_id: string;
  user_id: string;
}

function mapTeamPostLike(row: TeamPostLikeRow): TeamPostLike {
  return {
    postId: row.post_id,
    userId: row.user_id,
  };
}

export async function getTeamPostLikes(teamId: string) {
  const { data, error } = await supabase
    .from("team_post_likes")
    .select("post_id, user_id")
    .eq("team_id", teamId);

  if (error) throw error;

  return (data as TeamPostLikeRow[]).map(mapTeamPostLike);
}

export async function createTeamPostLike(
  teamId: string,
  postId: string,
  userId: string,
) {
  const { error } = await supabase.from("team_post_likes").insert({
    team_id: teamId,
    post_id: postId,
    user_id: userId,
  });

  if (error) throw error;
}

export async function deleteTeamPostLike(
  teamId: string,
  postId: string,
  userId: string,
) {
  const { error } = await supabase
    .from("team_post_likes")
    .delete()
    .eq("team_id", teamId)
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) throw error;
}
