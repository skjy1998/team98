import type { BoardPostFilter, TeamPost } from "@/types/board";

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

export function getRecentNoticePost(posts: TeamPost[], limit = 1): TeamPost[] {
  return posts.filter((post) => post.type === "notice").slice(0, limit);
}
