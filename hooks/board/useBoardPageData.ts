import { useTeamPostComments } from "./useTeamPostComments";
import { useTeamPostLikes } from "./useTeamPostLikes";
import { useTeamPosts } from "./useTeamPosts";

export function useBoardPageData() {
  const {
    posts,
    postsLoaded,
    postsError,
    currentUserId,
    canManage,
    createPost,
    updatePost,
    deletePost,
    incrementPostViewCount,
    reloadPosts,
  } = useTeamPosts();

  const {
    commentsByPostId,
    commentsLoaded,
    commentsError,
    createComment,
    updateComment,
    deleteComment,
    reloadComments,
  } = useTeamPostComments();

  const {
    likesByPostId,
    likesLoaded,
    likesError,
    togglePostLike,
    reloadLikes,
  } = useTeamPostLikes();

  const reloadBoardData = async () => {
    await Promise.all([reloadPosts(), reloadComments(), reloadLikes()]);
  };

  return {
    posts,
    boardLoaded: postsLoaded,
    boardError: postsError,
    currentUserId,
    canManage,
    createPost,
    updatePost,
    deletePost,
    incrementPostViewCount,
    commentsByPostId,
    commentsLoaded,
    commentsError,
    createComment,
    updateComment,
    deleteComment,
    likesByPostId,
    likesLoaded,
    likesError,
    togglePostLike,
    reloadBoardData,
  };
}
