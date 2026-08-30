import type { TeamPostCommentsByPostId } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import {
  createTeamPostComment,
  deleteTeamPostComment,
  getTeamPostComments,
  updateTeamPostComment,
} from "@/lib/board/board-comment-repository";
import {
  groupCommentsByPostId,
  removeCommentFromGroups,
} from "@/lib/board/board-ui";

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

    try {
      const comments = await getTeamPostComments(teamId);
      setCommentsByPostId(groupCommentsByPostId(comments));
    } catch (error) {
      console.error("team post comments load error", error);
      setCommentsByPostId({});
      setCommentsError("댓글을 불러오지 못했어요.");
    } finally {
      setCommentsLoaded(true);
    }
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

    try {
      await createTeamPostComment(
        teamId,
        postId,
        member.userId,
        normalizedContent,
      );

      await loadComments();
      return true;
    } catch (error) {
      console.error("team post comment create error", error);
      return false;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    const normalizedContent = content.trim();

    if (!teamId || !normalizedContent) return false;

    try {
      await updateTeamPostComment(teamId, commentId, normalizedContent);

      await loadComments();
      return true;
    } catch (error) {
      console.error("team post comment update error", error);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!teamId) return false;

    try {
      await deleteTeamPostComment(teamId, commentId);

      setCommentsByPostId((current) =>
        removeCommentFromGroups(current, commentId),
      );

      return true;
    } catch (error) {
      console.error("team post comment delete error", error);
      return false;
    }
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
