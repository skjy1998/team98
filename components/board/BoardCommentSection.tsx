import { useBoardCommentSectionState } from "@/hooks/board/useBoardCommentSectionState";
import type { TeamPostComment, TeamPostLikeSummary } from "@/types/board";
import { ChevronDown, Heart, MessageCircle } from "lucide-react";
import BoardCommentItem from "./BoardCommentItem";
import { useBoardLikeButtonState } from "@/hooks/board/useBoardLikeButtonState";

interface BoardCommentSectionProps {
  comments: TeamPostComment[];
  commentsLoaded: boolean;
  commentsError: string;
  currentUserId?: string;
  canManage: boolean;
  onCreate: (content: string) => Promise<boolean>;
  onUpdate: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  likeSummary: TeamPostLikeSummary;
  likesLoaded: boolean;
  onToggleLike: () => Promise<boolean>;
}

export default function BoardCommentSection({
  comments,
  commentsLoaded,
  commentsError,
  currentUserId,
  canManage,
  onCreate,
  onUpdate,
  onDelete,
  likeSummary,
  likesLoaded,
  onToggleLike,
}: Readonly<BoardCommentSectionProps>) {
  const {
    content,
    onChangeContent,
    editingCommentId,
    editingContent,
    onChangeEditingContent,
    isSubmitting,
    isCommentsOpen,
    commentsContentId,
    handleToggleComments,
    handleSubmit,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
  } = useBoardCommentSectionState({
    onCreate,
    onUpdate,
    onDelete,
  });

  const { isLikeSubmitting, handleToggleLike } = useBoardLikeButtonState({
    likesLoaded,
    onToggleLike,
  });

  return (
    <section className="mt-6 border-t border-stone-100 pt-5">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={!likesLoaded || isLikeSubmitting}
          aria-label={likeSummary.isLiked ? "좋아요 취소" : "좋아요"}
          aria-pressed={likeSummary.isLiked}
          className={[
            "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
            likeSummary.isLiked
              ? "bg-rose-50 text-rose-500"
              : "bg-stone-50 text-stone-400 hover:bg-rose-50 hover:text-rose-500",
          ].join(" ")}
        >
          <Heart
            className={[
              "h-4 w-4",
              likeSummary.isLiked ? "fill-current" : "",
            ].join(" ")}
          />
          <span>{likesLoaded ? likeSummary.count : "-"}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleComments}
          aria-expanded={isCommentsOpen}
          aria-controls={commentsContentId}
          className={[
            "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition",
            isCommentsOpen
              ? "bg-emerald-50 text-emerald-700"
              : "bg-stone-50 text-stone-500 hover:bg-stone-100",
          ].join(" ")}
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>{commentsLoaded ? comments.length : "-"}</span>
          <ChevronDown
            className={[
              "h-3.5 w-3.5 transition duration-200",
              isCommentsOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </div>
      {isCommentsOpen && (
        <div id={commentsContentId}>
          {!commentsLoaded ? (
            <p className="py-4 text-sm text-stone-400">댓글을 불러오는 중...</p>
          ) : commentsError ? (
            <p className="py-4 text-sm text-rose-500">{commentsError}</p>
          ) : comments.length === 0 ? (
            <p className="rounded-xl bg-stone-50 px-4 py-5 text-center text-sm text-stone-400">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const isAuthor = comment.authorId === currentUserId;

                return (
                  <BoardCommentItem
                    key={comment.id}
                    comment={comment}
                    isAuthor={isAuthor}
                    canManage={canManage}
                    isEditing={editingCommentId === comment.id}
                    editingContent={editingContent}
                    isSubmitting={isSubmitting}
                    onChangeEditingContent={onChangeEditingContent}
                    onStartEdit={() => handleStartEdit(comment)}
                    onSaveEdit={() => void handleSaveEdit()}
                    onCancelEdit={handleCancelEdit}
                    onDelete={() => void handleDelete(comment.id)}
                  />
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
            <textarea
              value={content}
              onChange={(event) => onChangeContent(event.target.value)}
              placeholder="댓글을 입력하세요."
              maxLength={1000}
              rows={2}
              disabled={isSubmitting}
              className="min-h-16 flex-1 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="h-16 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "등록 중" : "등록"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
