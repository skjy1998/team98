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
      <div className="relative flex min-h-full items-center justify-center px-4 py-6">
        <button
          type="button"
          tabIndex={-1}
          aria-label="게시물 작성 창 닫기"
          disabled={isSaving}
          onClick={onClose}
          className="absolute inset-0"
        />

        <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
          <button
            type="button"
            aria-label="닫기"
            disabled={isSaving}
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:bg-stone-50 hover:text-stone-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div>
            <p className="text-sm font-semibold text-emerald-700">게시판</p>
            <h2
              id="board-post-modal-title"
              className="mt-2 text-2xl font-bold text-stone-900"
            >
              {post ? "게시물 수정" : "새 게시물 작성"}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
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
