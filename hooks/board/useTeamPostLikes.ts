import type { TeamPostLikesByPostId } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import {
  createTeamPostLike,
  deleteTeamPostLike,
  getTeamPostLikes,
} from "@/lib/board/board-like-repository";
import { getLikesByPostId, toggleLikeSummary } from "@/lib/board/board-ui";

export function useTeamPostLikes() {
  const { team, teamLoaded } = useCurrentTeam();
  const { member, memberLoaded } = useCurrentTeamMember();

  const teamId = team?.id;
  const currentUserId = member?.userId;

  const [likesByPostId, setLikesByPostId] = useState<TeamPostLikesByPostId>({});
  const [likesLoaded, setLikesLoaded] = useState(false);
  const [likesError, setLikesError] = useState("");

  const loadLikes = useCallback(async () => {
    if (!teamLoaded || !memberLoaded) return;

    if (!teamId) {
      setLikesByPostId({});
      setLikesLoaded(true);
      return;
    }

    setLikesLoaded(false);
    setLikesError("");

    try {
      const likes = await getTeamPostLikes(teamId);

      setLikesByPostId(getLikesByPostId(likes, currentUserId));
    } catch (error) {
      console.error("team post likes load error", error);
      setLikesByPostId({});
      setLikesError("좋아요 정보를 불러오지 못했어요.");
    } finally {
      setLikesLoaded(true);
    }
  }, [teamLoaded, memberLoaded, teamId, currentUserId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLikes();
  }, [loadLikes]);

  const togglePostLike = async (postId: string) => {
    if (!teamId || !currentUserId) return false;

    const current = likesByPostId[postId] ?? {
      count: 0,
      isLiked: false,
    };

    try {
      if (current.isLiked) {
        const deleted = await deleteTeamPostLike(teamId, postId, currentUserId);

        if (!deleted) return false;
      } else {
        await createTeamPostLike(teamId, postId, currentUserId);
      }

      setLikesByPostId((previous) => toggleLikeSummary(previous, postId));

      return true;
    } catch (error) {
      console.error("team post like toggle error", error);
      return false;
    }
  };

  return {
    likesByPostId,
    likesLoaded,
    likesError,
    togglePostLike,
    reloadLikes: loadLikes,
  };
}
