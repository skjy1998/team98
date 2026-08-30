import { formatCommentDate } from "@/lib/board/board-ui";
import type { TeamPostComment } from "@/types/board";
import { Check, Pencil, Trash2, X } from "lucide-react";

interface BoardCommentItemProps {
  comment: TeamPostComment;
  isAuthor: boolean;
  canManage: boolean;
  isEditing: boolean;
  editingContent: string;
  isSubmitting: boolean;
  onChangeEditingContent: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

export default function BoardCommentItem({
  comment,
  isAuthor,
  canManage,
  isEditing,
  editingContent,
  isSubmitting,
  onChangeEditingContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: Readonly<BoardCommentItemProps>) {
  return (
    <div className="rounded-xl border border-stone-100 bg-stone-50/70 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-700">
              {comment.authorName}
            </span>
            <time dateTime={comment.createdAt} className="text-stone-400">
              {formatCommentDate(comment.createdAt)}
            </time>
          </div>

          {isEditing ? (
            <textarea
              value={editingContent}
              onChange={(event) => onChangeEditingContent(event.target.value)}
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
                onClick={onSaveEdit}
                disabled={isSubmitting || !editingContent.trim()}
                aria-label="댓글 수정 저장"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
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
                  onClick={onStartEdit}
                  aria-label="댓글 수정"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-white hover:text-stone-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {(isAuthor || canManage) && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isSubmitting}
                  aria-label="댓글 삭제"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
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
}
