import type { TeamPost } from "@/types/board";
import BoardPostItem from "./BoardPostItem";
import BoardCommentSection from "./BoardCommentSection";
import ContentState from "../common/ContentState";
import type {
  BoardCommentState,
  BoardLikeState,
  BoardPostActions,
} from "@/types/board-ui";
import { useBoardPostListState } from "@/hooks/board/useBoardPostListState";

interface BoardPostListProps {
  posts: TeamPost[];
  hasSearchCondition: boolean;
  commentState: BoardCommentState;
  likeState: BoardLikeState;
  postActions: BoardPostActions;
}

export default function BoardPostList({
  posts,
  hasSearchCondition,
  commentState,
  likeState,
  postActions,
}: Readonly<BoardPostListProps>) {
  const {
    commentsByPostId,
    commentsLoaded,
    commentsError,
    onCreateComment,
    onUpdateComment,
    onDeleteComment,
  } = commentState;

  const { likesByPostId, likesLoaded, onToggleLike } = likeState;

  const {
    currentUserId,
    canManage,
    onEdit,
    onTogglePin,
    onDelete,
    onViewPost,
  } = postActions;

  const { expandedPostId, handleTogglePost } = useBoardPostListState({
    onViewPost,
  });

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
