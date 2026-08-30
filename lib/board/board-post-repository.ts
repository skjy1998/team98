import type { PostType, TeamPost } from "@/types/board";
import { supabase } from "../supabase";

interface TeamPostRow {
  id: string;
  team_id: string;
  author_id: string | null;
  type: PostType;
  title: string;
  content: string;
  is_pinned: boolean;
  view_count: number;
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

interface CreateTeamPostValue {
  type: PostType;
  title: string;
  content: string;
  isPinned: boolean;
}

interface UpdateTeamPostValue {
  type?: PostType;
  title: string;
  content: string;
  isPinned?: boolean;
}

const POST_COLUMNS = `
  id,
  team_id,
  author_id,
  type,
  title,
  content,
  is_pinned,
  view_count,
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

function mapTeamPost(
  row: TeamPostRow,
  authorNames: Map<string, string>,
): TeamPost {
  return {
    id: row.id,
    teamId: row.team_id,
    authorId: row.author_id ?? undefined,
    authorName: row.author_id
      ? (authorNames.get(row.author_id) ?? "팀원")
      : "탈퇴한 회원",
    type: row.type,
    title: row.title,
    content: row.content,
    isPinned: row.is_pinned,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTeamPosts(teamId: string) {
  const [postsResult, membersResult, playersResult] = await Promise.all([
    supabase
      .from("team_posts")
      .select(POST_COLUMNS)
      .eq("team_id", teamId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false }),

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

  if (postsResult.error) throw postsResult.error;
  if (membersResult.error) throw membersResult.error;
  if (playersResult.error) throw playersResult.error;

  const authorNames = createAuthorNames(
    membersResult.data as TeamMemberNameRow[],
    playersResult.data as PlayerNameRow[],
  );

  return (postsResult.data as TeamPostRow[]).map((row) =>
    mapTeamPost(row, authorNames),
  );
}

export async function createTeamPost(
  teamId: string,
  authorId: string,
  value: CreateTeamPostValue,
) {
  const { error } = await supabase.from("team_posts").insert({
    team_id: teamId,
    author_id: authorId,
    type: value.type,
    title: value.title,
    content: value.content,
    is_pinned: value.isPinned,
  });

  if (error) throw error;
}

export async function updateTeamPost(
  teamId: string,
  postId: string,
  value: UpdateTeamPostValue,
) {
  const updateValue = {
    title: value.title,
    content: value.content,
    updated_at: new Date().toISOString(),
    ...(value.type !== undefined && { type: value.type }),
    ...(value.isPinned !== undefined && {
      is_pinned: value.isPinned,
    }),
  };

  const { error } = await supabase
    .from("team_posts")
    .update(updateValue)
    .eq("id", postId)
    .eq("team_id", teamId);

  if (error) throw error;
}

export async function deleteTeamPost(teamId: string, postId: string) {
  const { error } = await supabase
    .from("team_posts")
    .delete()
    .eq("id", postId)
    .eq("team_id", teamId);

  if (error) throw error;
}

export async function incrementTeamPostViewCount(postId: string) {
  const { error } = await supabase.rpc("increment_team_post_view_count", {
    target_post_id: postId,
  });

  if (error) throw error;
}
