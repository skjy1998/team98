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
      <div className="mt-7 space-y-5">
        {canManage && (
          <div>
            <p className="mb-2 text-sm font-semibold text-stone-600">
              게시물 유형
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => onChangeType("general")}
                className={[
                  "h-11 rounded-xl border text-sm font-semibold transition",
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
                  "h-11 rounded-xl border text-sm font-semibold transition",
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
            className="mb-2 block text-sm font-semibold text-stone-600"
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
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:bg-stone-100"
          />
          <p className="mt-1 text-right text-xs text-stone-400">
            {title.length}/100
          </p>
        </div>

        <div>
          <label
            htmlFor="board-post-content"
            className="mb-2 block text-sm font-semibold text-stone-600"
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
            className="min-h-60 w-full resize-y rounded-xl border border-stone-200 p-4 text-sm leading-7 text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:bg-stone-100"
          />
          <p className="mt-1 text-right text-xs text-stone-400">
            {content.length}/5000
          </p>
        </div>

        {canManage && (
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">
                상단에 고정
              </p>
              <p className="mt-1 text-xs text-amber-600">
                중요한 공지를 게시판 최상단에 표시해요.
              </p>
            </div>

            <input
              type="checkbox"
              checked={isPinned}
              disabled={isSaving}
              onChange={(event) => onChangeIsPinned(event.target.checked)}
              className="h-5 w-5 accent-amber-500"
            />
          </label>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-2">
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
