import type {
  TeamPost,
  TeamPostCommentsByPostId,
  TeamPostLikesByPostId,
} from "./board";

export interface BoardCommentState {
  commentsByPostId: TeamPostCommentsByPostId;
  commentsLoaded: boolean;
  commentsError: string;
  onCreateComment: (postId: string, content: string) => Promise<boolean>;
  onUpdateComment: (commentId: string, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<boolean>;
}

export interface BoardLikeState {
  likesByPostId: TeamPostLikesByPostId;
  likesLoaded: boolean;
  onToggleLike: (postId: string) => Promise<boolean>;
}

export interface BoardPostActions {
  currentUserId?: string;
  canManage: boolean;
  onEdit: (post: TeamPost) => void;
  onTogglePin: (post: TeamPost) => Promise<void>;
  onDelete: (post: TeamPost) => Promise<void>;
  onViewPost: (postId: string) => Promise<boolean>;
}
