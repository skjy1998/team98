import type { PostType, TeamPost, TeamPostFormValue } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

function mapPost(row: TeamPostRow, authorNames: Map<string, string>): TeamPost {
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

export function useTeamPosts() {
  const { team, teamLoaded } = useCurrentTeam();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();
  const teamId = team?.id;

  const [posts, setPosts] = useState<TeamPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [postsError, setPostsError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!teamLoaded || !memberLoaded) return;

    if (!teamId) {
      setPosts([]);
      setPostsLoaded(true);
      return;
    }

    setPostsLoaded(false);
    setPostsError("");

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

    if (postsResult.error || !postsResult.data) {
      console.error("team posts load error", postsResult.error);
      setPosts([]);
      setPostsError("게시물을 불러오지 못했어요.");
      setPostsLoaded(true);
      return;
    }

    const authorNames = new Map<string, string>();

    for (const row of membersResult.data ?? []) {
      const memberRow = row as TeamMemberNameRow;

      if (memberRow.display_name) {
        authorNames.set(memberRow.user_id, memberRow.display_name);
      }
    }

    for (const row of playersResult.data ?? []) {
      const playerRow = row as PlayerNameRow;

      if (playerRow.user_id) {
        authorNames.set(playerRow.user_id, playerRow.name);
      }
    }

    setPosts(
      (postsResult.data as TeamPostRow[]).map((row) =>
        mapPost(row, authorNames),
      ),
    );
    setPostsLoaded(true);
  }, [teamLoaded, memberLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
  }, [loadPosts]);

  const createPost = async (value: TeamPostFormValue) => {
    if (!teamId || !member?.userId) return false;

    const type = canManage ? value.type : "general";
    const isPinned = canManage && value.isPinned;

    const { error } = await supabase.from("team_posts").insert({
      team_id: teamId,
      author_id: member.userId,
      type,
      title: value.title.trim(),
      content: value.content.trim(),
      is_pinned: isPinned,
    });

    if (error) {
      console.error("team post create error", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return false;
    }

    await loadPosts();
    return true;
  };

  const updatePost = async (postId: string, value: TeamPostFormValue) => {
    if (!teamId) return false;

    const updateValue = canManage
      ? {
          type: value.type,
          title: value.title.trim(),
          content: value.content.trim(),
          is_pinned: value.isPinned,
          updated_at: new Date().toISOString(),
        }
      : {
          title: value.title.trim(),
          content: value.content.trim(),
          updated_at: new Date().toISOString(),
        };

    const { error } = await supabase
      .from("team_posts")
      .update(updateValue)
      .eq("id", postId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team post update error", error);
      return false;
    }

    await loadPosts();
    return true;
  };

  const deletePost = async (postId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("team_posts")
      .delete()
      .eq("id", postId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team post delete error", error);
      return false;
    }

    setPosts((current) => current.filter((post) => post.id !== postId));

    return true;
  };

  const incrementPostViewCount = async (postId: string) => {
    if (!teamId) return false;

    const { error } = await supabase.rpc("increment_team_post_view_count", {
      target_post_id: postId,
    });

    if (error) {
      console.error("team post view count update error", error);
      return false;
    }

    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, viewCount: post.viewCount + 1 } : post,
      ),
    );

    return true;
  };

  return {
    posts,
    postsLoaded,
    postsError,
    currentUserId: member?.userId,
    canManage,
    createPost,
    updatePost,
    deletePost,
    incrementPostViewCount,
    reloadPosts: loadPosts,
  };
}
