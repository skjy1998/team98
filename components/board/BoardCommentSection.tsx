import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { TeamPostComment, TeamPostLikeSummary } from "@/types/board";
import {
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { type SubmitEvent, useId, useState } from "react";

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

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const commentsContentId = useId();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onCreate(content);
    setIsSubmitting(false);

    if (success) {
      setContent("");
      return;
    }

    showToast("댓글 등록에 실패했어요.", "error");
  };

  const handleStartEdit = (comment: TeamPostComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onUpdate(editingCommentId, editingContent);
    setIsSubmitting(false);

    if (success) {
      handleCancelEdit();
      return;
    }

    showToast("댓글 수정에 실패했어요.", "error");
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = await confirm({
      title: "댓글 삭제",
      description: "이 댓글을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await onDelete(commentId);

    if (!success) {
      showToast("댓글 삭제에 실패했어요.", "error");
      return;
    }

    showToast("댓글을 삭제했어요.", "success");
  };

  const handleToggleLike = async () => {
    if (!likesLoaded || isLikeSubmitting) return;

    setIsLikeSubmitting(true);
    const success = await onToggleLike();
    setIsLikeSubmitting(false);

    if (!success) {
      showToast("좋아요 처리에 실패했어요.", "error");
    }
  };

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
          onClick={() => setIsCommentsOpen((current) => !current)}
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
                const isEditing = editingCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-stone-100 bg-stone-50/70 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-stone-700">
                            {comment.authorName}
                          </span>
                          <time
                            dateTime={comment.createdAt}
                            className="text-stone-400"
                          >
                            {formatCommentDate(comment.createdAt)}
                          </time>
                        </div>

                        {isEditing ? (
                          <textarea
                            value={editingContent}
                            onChange={(event) =>
                              setEditingContent(event.target.value)
                            }
                            maxLength={1000}
                            rows={3}
                            disabled={isSubmitting}
                            className="mt-3 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-stone-100"
                          />
                        ) : (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">
                            {comment.content}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              disabled={isSubmitting || !editingContent.trim()}
                              aria-label="댓글 수정 저장"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                              aria-label="댓글 수정 취소"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {isAuthor && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(comment)}
                                aria-label="댓글 수정"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-white hover:text-stone-700"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {(isAuthor || canManage) && (
                              <button
                                type="button"
                                onClick={() => handleDelete(comment.id)}
                                aria-label="댓글 삭제"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
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
