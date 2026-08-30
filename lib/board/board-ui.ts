import type {
  BoardPostFilter,
  TeamPost,
  TeamPostComment,
  TeamPostCommentsByPostId,
  TeamPostLike,
  TeamPostLikesByPostId,
} from "@/types/board";

export function getFilteredPosts(
  posts: TeamPost[],
  filter: BoardPostFilter,
  search: string,
) {
  const keyword = search.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesFilter = filter === "all" || post.type === filter;

    const matchesSearch =
      !keyword ||
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword) ||
      post.authorName.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });
}

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getRecentNoticePost(posts: TeamPost[], limit = 1): TeamPost[] {
  return posts.filter((post) => post.type === "notice").slice(0, limit);
}

export function getLikesByPostId(
  likes: TeamPostLike[],
  currentUserId?: string,
): TeamPostLikesByPostId {
  return likes.reduce<TeamPostLikesByPostId>((result, like) => {
    const current = result[like.postId] ?? {
      count: 0,
      isLiked: false,
    };

    result[like.postId] = {
      count: current.count + 1,
      isLiked: current.isLiked || like.userId === currentUserId,
    };

    return result;
  }, {});
}

export function toggleLikeSummary(
  previous: TeamPostLikesByPostId,
  postId: string,
): TeamPostLikesByPostId {
  const current = previous[postId] ?? {
    count: 0,
    isLiked: false,
  };

  return {
    ...previous,
    [postId]: {
      count: current.isLiked
        ? Math.max(0, current.count - 1)
        : current.count + 1,
      isLiked: !current.isLiked,
    },
  };
}

export function groupCommentsByPostId(
  comments: TeamPostComment[],
): TeamPostCommentsByPostId {
  return comments.reduce<TeamPostCommentsByPostId>((result, comment) => {
    const current = result[comment.postId] ?? [];

    result[comment.postId] = [...current, comment];
    return result;
  }, {});
}

export function removeCommentFromGroups(
  commentsByPostId: TeamPostCommentsByPostId,
  commentId: string,
): TeamPostCommentsByPostId {
  return Object.fromEntries(
    Object.entries(commentsByPostId).map(([postId, comments]) => [
      postId,
      comments.filter((comment) => comment.id !== commentId),
    ]),
  );
}
