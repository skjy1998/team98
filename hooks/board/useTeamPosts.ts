import type { TeamPost, TeamPostFormValue } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import {
  createTeamPost,
  deleteTeamPost,
  getTeamPosts,
  incrementTeamPostViewCount,
  updateTeamPost,
} from "@/lib/board/board-post-repository";

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

    try {
      const nextPosts = await getTeamPosts(teamId);
      setPosts(nextPosts);
    } catch (error) {
      console.error("team posts load error", error);
      setPosts([]);
      setPostsError("게시물을 불러오지 못했어요.");
    } finally {
      setPostsLoaded(true);
    }
  }, [teamLoaded, memberLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
  }, [loadPosts]);

  const createPost = async (value: TeamPostFormValue) => {
    if (!teamId || !member?.userId) return false;

    try {
      await createTeamPost(teamId, member.userId, {
        type: canManage ? value.type : "general",
        title: value.title.trim(),
        content: value.content.trim(),
        isPinned: canManage && value.isPinned,
      });

      await loadPosts();
      return true;
    } catch (error) {
      console.error("team post create error", error);
      return false;
    }
  };

  const updatePost = async (postId: string, value: TeamPostFormValue) => {
    if (!teamId) return false;

    const updateValue = canManage
      ? {
          type: value.type,
          title: value.title.trim(),
          content: value.content.trim(),
          isPinned: value.isPinned,
        }
      : {
          title: value.title.trim(),
          content: value.content.trim(),
        };

    try {
      await updateTeamPost(teamId, postId, updateValue);
      await loadPosts();
      return true;
    } catch (error) {
      console.error("team post update error", error);
      return false;
    }
  };

  const deletePost = async (postId: string) => {
    if (!teamId) return false;

    try {
      await deleteTeamPost(teamId, postId);

      setPosts((current) => current.filter((post) => post.id !== postId));

      return true;
    } catch (error) {
      console.error("team post delete error", error);
      return false;
    }
  };

  const incrementPostViewCount = async (postId: string) => {
    if (!teamId) return false;

    try {
      await incrementTeamPostViewCount(postId);

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, viewCount: post.viewCount + 1 }
            : post,
        ),
      );

      return true;
    } catch (error) {
      console.error("team post view count update error", error);
      return false;
    }
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
