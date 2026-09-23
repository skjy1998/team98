import type { useBoardPostForm } from "@/hooks/board/useBoardPostForm";

interface BoardPostFormProps {
  canManage: boolean;
  isEdit: boolean;
  form: ReturnType<typeof useBoardPostForm>;
  onCancel: () => void;
}

export default function BoardPostForm({
  canManage,
  isEdit,
  form,
  onCancel,
}: Readonly<BoardPostFormProps>) {
  const {
    type,
    onChangeType,
    title,
    onChangeTitle,
    content,
    onChangeContent,
    isPinned,
    onChangeIsPinned,
    isSaving,
    handleSave,
  } = form;

  return (
    <>
      <div className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
        {canManage && (
          <div>
            <p className="mb-1.5 block text-xs font-semibold text-stone-600 sm:mb-2 sm:text-sm">
              게시물 유형
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => onChangeType("general")}
                className={[
                  "h-10 rounded-xl border text-xs font-semibold transition sm:h-11 sm:text-sm",
                  type === "general"
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                ].join(" ")}
              >
                일반 게시물
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => onChangeType("notice")}
                className={[
                  "h-10 rounded-xl border text-xs font-semibold transition sm:h-11 sm:text-sm",
                  type === "notice"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                ].join(" ")}
              >
                공지사항
              </button>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="board-post-title"
            className="mb-1.5 block text-xs font-semibold text-stone-600 sm:mb-2 sm:text-sm"
          >
            제목
          </label>
          <input
            autoFocus
            id="board-post-title"
            value={title}
            maxLength={100}
            disabled={isSaving}
            onChange={(event) => onChangeTitle(event.target.value)}
            placeholder="게시물 제목을 입력하세요."
            className="h-11 w-full rounded-xl border border-stone-200 px-3.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:bg-stone-100 sm:h-12 sm:px-4 "
          />
          <p className="mt-1 text-right text-xs text-stone-400">
            {title.length}/100
          </p>
        </div>

        <div>
          <label
            htmlFor="board-post-content"
            className="mb-1.5 block text-xs font-semibold text-stone-600 sm:mb-2 sm:text-sm"
          >
            내용
          </label>
          <textarea
            id="board-post-content"
            value={content}
            maxLength={5000}
            disabled={isSaving}
            onChange={(event) => onChangeContent(event.target.value)}
            placeholder="팀원들과 공유할 내용을 입력하세요."
            className="min-h-48 w-full resize-y rounded-xl border border-stone-200 p-3 text-sm leading-6 text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:bg-stone-100 sm:min-h-60 sm:p-4 sm:leading-7"
          />
          <p className="mt-1 text-right text-xs text-stone-400">
            {content.length}/5000
          </p>
        </div>

        {canManage && (
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-3 sm:px-4 sm:py-4">
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                상단에 고정
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                중요한 공지를 게시판 최상단에 표시해요.
              </p>
            </div>

            <input
              type="checkbox"
              checked={isPinned}
              disabled={isSaving}
              onChange={(event) => onChangeIsPinned(event.target.checked)}
              className="h-5 w-5 accent-emerald-500"
            />
          </label>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="h-12 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50 disabled:opacity-50"
        >
          취소
        </button>

        <button
          type="button"
          disabled={isSaving || !title.trim() || !content.trim()}
          onClick={() => void handleSave()}
          className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSaving ? "저장 중..." : isEdit ? "수정 완료" : "게시하기"}
        </button>
      </div>
    </>
  );
}
