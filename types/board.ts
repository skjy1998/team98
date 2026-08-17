export const postTypes = ["notice", "general"] as const;

export type PostType = (typeof postTypes)[number];

export type BoardPostFilter = "all" | PostType;

export type TeamPostCommentsByPostId = Record<string, TeamPostComment[]>;

export type TeamPostLikesByPostId = Record<string, TeamPostLikeSummary>;

export interface TeamPost {
  id: string;
  teamId: string;
  authorId?: string;
  authorName: string;
  type: PostType;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPostFormValue {
  type: PostType;
  title: string;
  content: string;
  isPinned: boolean;
}

export interface TeamPostComment {
  id: string;
  postId: string;
  teamId: string;
  authorId?: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPostLikeSummary {
  count: number;
  isLiked: boolean;
}
