interface MatchRecordStatusPanelProps {
  isCompleted: boolean;
  canManage: boolean;
  hasMatchStarted: boolean;
  isCompletionSaving: boolean;
  onChangeCompletion: () => void | Promise<void>;
}

export default function MatchRecordStatusPanel({
  isCompleted,
  canManage,
  hasMatchStarted,
  isCompletionSaving,
  onChangeCompletion,
}: Readonly<MatchRecordStatusPanelProps>) {
  const statusLabel = isCompleted ? "기록 완료" : "작성 중";

  const statusDescription = isCompleted
    ? "완료된 기록은 다시 수정하기 전까지 잠겨요."
    : "기록 입력이 끝나면 완료 상태로 변경해 주세요.";

  let actionLabel = isCompleted ? "다시 수정" : "기록 완료";

  if (isCompletionSaving) {
    actionLabel = "처리 중...";
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 sm:items-center sm:px-5 sm:py-4">
        <div className="min-w-0">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              isCompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {statusLabel}
          </span>

          <p className="mt-2 text-xs text-stone-400 sm:text-sm">
            <span className="sm:hidden">
              {isCompleted
                ? "수정하려면 완료를 해제하세요."
                : "입력이 끝나면 완료 처리하세요."}
            </span>
            <span className="hidden sm:inline">{statusDescription}</span>
          </p>
        </div>

        {canManage && hasMatchStarted && (
          <button
            type="button"
            disabled={isCompletionSaving}
            onClick={() => void onChangeCompletion()}
            className={[
              "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm",
              isCompleted
                ? "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            ].join(" ")}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {canManage && !hasMatchStarted && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-3 text-xs font-medium text-sky-700 sm:px-4 sm:text-sm">
          경기 시작 전에는 기록을 입력할 수 없어요.
        </div>
      )}

      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 text-xs text-stone-500 sm:px-4 sm:text-sm">
          경기 기록은 운영진만 수정할 수 있어요.
        </div>
      )}

      {canManage && isCompleted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-700 sm:px-4 sm:text-sm">
          완료된 경기 기록이에요. 수정하려면 먼저 다시 수정 버튼을 눌러주세요.
        </div>
      )}
    </div>
  );
}
