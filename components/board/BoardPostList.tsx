import type {
  TeamPost,
  TeamPostCommentsByPostId,
  TeamPostLikesByPostId,
} from "@/types/board";
import BoardPostItem from "./BoardPostItem";
import { useRef, useState } from "react";
import BoardCommentSection from "./BoardCommentSection";
import ContentState from "../common/ContentState";

interface BoardPostListProps {
  posts: TeamPost[];
  hasSearchCondition: boolean;
  currentUserId?: string;
  canManage: boolean;
  commentsByPostId: TeamPostCommentsByPostId;
  commentsLoaded: boolean;
  commentsError: string;
  onCreateComment: (postId: string, content: string) => Promise<boolean>;
  onUpdateComment: (commentId: string, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<boolean>;
  onEdit: (post: TeamPost) => void;
  onTogglePin: (post: TeamPost) => Promise<void>;
  onDelete: (post: TeamPost) => Promise<void>;
  onViewPost: (postId: string) => Promise<boolean>;
  likesByPostId: TeamPostLikesByPostId;
  likesLoaded: boolean;
  onToggleLike: (postId: string) => Promise<boolean>;
}

export default function BoardPostList({
  posts,
  hasSearchCondition,
  currentUserId,
  canManage,
  commentsByPostId,
  commentsLoaded,
  commentsError,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onEdit,
  onTogglePin,
  onDelete,
  onViewPost,
  likesByPostId,
  likesLoaded,
  onToggleLike,
}: Readonly<BoardPostListProps>) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const viewedPostIds = useRef(new Set<string>());

  const handleTogglePost = async (postId: string) => {
    const isOpening = expandedPostId !== postId;

    setExpandedPostId(isOpening ? postId : null);

    if (!isOpening || viewedPostIds.current.has(postId)) return;

    viewedPostIds.current.add(postId);

    const success = await onViewPost(postId);

    if (!success) {
      viewedPostIds.current.delete(postId);
    }
  };

  if (posts.length === 0) {
    return (
      <ContentState
        variant="empty"
        title={
          hasSearchCondition
            ? "조건에 맞는 게시물이 없어요."
            : "아직 작성된 게시물이 없어요."
        }
        description={
          hasSearchCondition
            ? "검색어나 필터를 변경해 보세요."
            : "첫 번째 게시물을 작성해 보세요."
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const comments = commentsByPostId[post.id] ?? [];
        const likeSummary = likesByPostId[post.id] ?? {
          count: 0,
          isLiked: false,
        };

        return (
          <BoardPostItem
            key={post.id}
            post={post}
            isExpanded={expandedPostId === post.id}
            canEdit={post.authorId === currentUserId || canManage}
            canPin={canManage}
            commentCount={comments.length}
            commentsLoaded={commentsLoaded}
            onToggle={() => handleTogglePost(post.id)}
            onEdit={() => onEdit(post)}
            onTogglePin={() => onTogglePin(post)}
            onDelete={() => onDelete(post)}
          >
            <BoardCommentSection
              comments={comments}
              commentsLoaded={commentsLoaded}
              commentsError={commentsError}
              currentUserId={currentUserId}
              canManage={canManage}
              likeSummary={likeSummary}
              likesLoaded={likesLoaded}
              onToggleLike={() => onToggleLike(post.id)}
              onCreate={(content) => onCreateComment(post.id, content)}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          </BoardPostItem>
        );
      })}
    </div>
  );
}
