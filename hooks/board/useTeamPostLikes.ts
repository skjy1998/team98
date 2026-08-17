import type { TeamPostLikesByPostId } from "@/types/board";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface TeamPostLikeRow {
  post_id: string;
  user_id: string;
}

function getLikesByPostId(
  rows: TeamPostLikeRow[],
  currentUserId?: string,
): TeamPostLikesByPostId {
  return rows.reduce<TeamPostLikesByPostId>((result, row) => {
    const current = result[row.post_id] ?? {
      count: 0,
      isLiked: false,
    };

    result[row.post_id] = {
      count: current.count + 1,
      isLiked: current.isLiked || row.user_id === currentUserId,
    };

    return result;
  }, {});
}

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

    const { data, error } = await supabase
      .from("team_post_likes")
      .select("post_id, user_id")
      .eq("team_id", teamId);

    if (error || !data) {
      console.error("team post likes load error", error);
      setLikesByPostId({});
      setLikesError("좋아요 정보를 불러오지 못했어요.");
      setLikesLoaded(true);
      return;
    }

    setLikesByPostId(
      getLikesByPostId(data as TeamPostLikeRow[], currentUserId),
    );
    setLikesLoaded(true);
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

    const query = current.isLiked
      ? supabase
          .from("team_post_likes")
          .delete()
          .eq("team_id", teamId)
          .eq("post_id", postId)
          .eq("user_id", currentUserId)
      : supabase.from("team_post_likes").insert({
          team_id: teamId,
          post_id: postId,
          user_id: currentUserId,
        });

    const { error } = await query;

    if (error) {
      console.error("team post like toggle error", error);
      return false;
    }

    setLikesByPostId((previous) => ({
      ...previous,
      [postId]: {
        count: current.isLiked
          ? Math.max(0, current.count - 1)
          : current.count + 1,
        isLiked: !current.isLiked,
      },
    }));

    return true;
  };

  return {
    likesByPostId,
    likesLoaded,
    likesError,
    togglePostLike,
    reloadLikes: loadLikes,
  };
}
