import { supabase } from "../supabase";
import type { TeamPostComment } from "@/types/board";

interface TeamPostCommentRow {
  id: string;
  post_id: string;
  team_id: string;
  author_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface TeamMemberNameRow {
  user_id: string;
  display_name: string | null;
}

interface PlayerNameRow {
  user_id: string | null;
  name: string;
}

const COMMENT_COLUMNS = `
  id,
  post_id,
  team_id,
  author_id,
  content,
  created_at,
  updated_at
`;

function createAuthorNames(
  members: TeamMemberNameRow[],
  players: PlayerNameRow[],
) {
  const authorNames = new Map<string, string>();

  members.forEach((member) => {
    if (member.display_name) {
      authorNames.set(member.user_id, member.display_name);
    }
  });

  players.forEach((player) => {
    if (player.user_id) {
      authorNames.set(player.user_id, player.name);
    }
  });

  return authorNames;
}

function mapTeamPostComment(
  row: TeamPostCommentRow,
  authorNames: Map<string, string>,
): TeamPostComment {
  return {
    id: row.id,
    postId: row.post_id,
    teamId: row.team_id,
    authorId: row.author_id ?? undefined,
    authorName: row.author_id
      ? (authorNames.get(row.author_id) ?? "팀원")
      : "탈퇴한 회원",
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTeamPostComments(teamId: string) {
  const [commentsResult, membersResult, playersResult] = await Promise.all([
    supabase
      .from("team_post_comments")
      .select(COMMENT_COLUMNS)
      .eq("team_id", teamId)
      .order("created_at", { ascending: true }),

    supabase
      .from("team_members")
      .select("user_id, display_name")
      .eq("team_id", teamId),

    supabase
      .from("players")
      .select("user_id, name")
      .eq("team_id", teamId)
      .not("user_id", "is", null),
  ]);

  if (commentsResult.error) throw commentsResult.error;
  if (membersResult.error) throw membersResult.error;
  if (playersResult.error) throw playersResult.error;

  const authorNames = createAuthorNames(
    membersResult.data as TeamMemberNameRow[],
    playersResult.data as PlayerNameRow[],
  );

  return (commentsResult.data as TeamPostCommentRow[]).map((row) =>
    mapTeamPostComment(row, authorNames),
  );
}

export async function createTeamPostComment(
  teamId: string,
  postId: string,
  authorId: string,
  content: string,
) {
  const { error } = await supabase.from("team_post_comments").insert({
    post_id: postId,
    team_id: teamId,
    author_id: authorId,
    content,
  });

  if (error) throw error;
}

export async function updateTeamPostComment(
  teamId: string,
  commentId: string,
  content: string,
) {
  const { error } = await supabase
    .from("team_post_comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("team_id", teamId);

  if (error) throw error;
}

export async function deleteTeamPostComment(teamId: string, commentId: string) {
  const { error } = await supabase
    .from("team_post_comments")
    .delete()
    .eq("id", commentId)
    .eq("team_id", teamId);

  if (error) throw error;
}
