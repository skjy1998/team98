import { useBoardPostForm } from "@/hooks/board/useBoardPostForm";
import type { TeamPost, TeamPostFormValue } from "@/types/board";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import BoardPostForm from "./BoardPostForm";

interface BoardPostModalProps {
  post?: TeamPost;
  canManage: boolean;
  onClose: () => void;
  onSave: (value: TeamPostFormValue) => Promise<boolean>;
}

export default function BoardPostModal({
  post,
  canManage,
  onClose,
  onSave,
}: Readonly<BoardPostModalProps>) {
  const form = useBoardPostForm({
    post,
    canManage,
    onSave,
    onClose,
  });

  const { isSaving } = form;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="board-post-modal-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!isSaving) {
          onClose();
        }
      }}
      className="m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0 backdrop:bg-black/35"
    >
      <div className="relative flex min-h-full items-end justify-center p-0 sm:items-center sm:px-4 sm:py-6">
        <button
          type="button"
          tabIndex={-1}
          aria-label="게시물 작성 창 닫기"
          disabled={isSaving}
          onClick={onClose}
          className="absolute inset-0"
        />

        <div className="relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6 md:p-8">
          <button
            type="button"
            aria-label="닫기"
            disabled={isSaving}
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:bg-stone-50 hover:text-stone-700 disabled:opacity-50 sm:right-5 sm:top-5 sm:h-9 sm:w-9"
          >
            <X className="h-4 w-4" />
          </button>

          <div>
            <p className="text-xs font-semibold text-emerald-700 sm:text-sm">
              게시판
            </p>
            <h2
              id="board-post-modal-title"
              className="mt-1.5 text-xl font-bold text-stone-900 sm:mt-2 sm:text-2xl"
            >
              {post ? "게시물 수정" : "새 게시물 작성"}
            </h2>
            <p className="mt-1.5 text-xs text-stone-500 sm:mt-2 sm:text-sm">
              {post
                ? "게시물의 제목과 내용을 수정하세요."
                : "팀원들과 공유할 공지나 이야기를 작성하세요."}
            </p>
          </div>
          <BoardPostForm
            canManage={canManage}
            isEdit={Boolean(post)}
            form={form}
            onCancel={onClose}
          />
        </div>
      </div>
    </dialog>
  );
}
