import type { TeamPostComment, TeamPostCommentsByPostId } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

function mapComment(
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

function groupComments(comments: TeamPostComment[]): TeamPostCommentsByPostId {
  return comments.reduce<TeamPostCommentsByPostId>((result, comment) => {
    const current = result[comment.postId] ?? [];

    result[comment.postId] = [...current, comment];
    return result;
  }, {});
}

export function useTeamPostComments() {
  const { team, teamLoaded } = useCurrentTeam();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();
  const teamId = team?.id;

  const [commentsByPostId, setCommentsByPostId] =
    useState<TeamPostCommentsByPostId>({});
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  const loadComments = useCallback(async () => {
    if (!teamLoaded || !memberLoaded) return;

    if (!teamId) {
      setCommentsByPostId({});
      setCommentsLoaded(true);
      return;
    }

    setCommentsLoaded(false);
    setCommentsError("");

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

    if (commentsResult.error || !commentsResult.data) {
      console.error("team post comments load error", commentsResult.error);
      setCommentsByPostId({});
      setCommentsError("댓글을 불러오지 못했어요.");
      setCommentsLoaded(true);
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

    const comments = (commentsResult.data as TeamPostCommentRow[]).map((row) =>
      mapComment(row, authorNames),
    );

    setCommentsByPostId(groupComments(comments));
    setCommentsLoaded(true);
  }, [teamLoaded, memberLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadComments();
  }, [loadComments]);

  const createComment = async (postId: string, content: string) => {
    const normalizedContent = content.trim();

    if (!teamId || !member?.userId || !normalizedContent) {
      return false;
    }

    const { error } = await supabase.from("team_post_comments").insert({
      post_id: postId,
      team_id: teamId,
      author_id: member.userId,
      content: normalizedContent,
    });

    if (error) {
      console.error("team post comment create error", error);
      return false;
    }

    await loadComments();
    return true;
  };

  const updateComment = async (commentId: string, content: string) => {
    if (!teamId || !content.trim()) return false;

    const { error } = await supabase
      .from("team_post_comments")
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team post comment update error", error);
      return false;
    }

    await loadComments();
    return true;
  };

  const deleteComment = async (commentId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("team_post_comments")
      .delete()
      .eq("id", commentId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team post comment delete error", error);
      return false;
    }

    setCommentsByPostId((current) => {
      const next: TeamPostCommentsByPostId = {};

      for (const [postId, comments] of Object.entries(current)) {
        next[postId] = comments.filter((comment) => comment.id !== commentId);
      }

      return next;
    });

    return true;
  };

  return {
    commentsByPostId,
    commentsLoaded,
    commentsError,
    currentUserId: member?.userId,
    canManage,
    createComment,
    updateComment,
    deleteComment,
    reloadComments: loadComments,
  };
}
