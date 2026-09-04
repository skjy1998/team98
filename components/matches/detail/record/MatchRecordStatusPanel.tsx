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
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4">
        <div>
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              isCompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {isCompleted ? "기록 완료" : "작성 중"}
          </span>

          <p className="mt-2 text-sm text-stone-400">
            {isCompleted
              ? "완료된 기록은 다시 수정하기 전까지 잠겨요."
              : "기록 입력이 끝나면 완료 상태로 변경해 주세요."}
          </p>
        </div>

        {canManage && hasMatchStarted && (
          <button
            type="button"
            disabled={isCompletionSaving}
            onClick={() => void onChangeCompletion()}
            className={[
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
              isCompleted
                ? "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            ].join(" ")}
          >
            {isCompletionSaving
              ? "처리 중..."
              : isCompleted
                ? "다시 수정"
                : "기록 완료"}
          </button>
        )}
      </div>

      {canManage && !hasMatchStarted && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
          경기 시작 전에는 기록을 입력할 수 없어요.
        </div>
      )}

      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          경기 기록은 운영진만 수정할 수 있어요.
        </div>
      )}

      {canManage && isCompleted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          완료된 경기 기록이에요. 수정하려면 먼저 다시 수정 버튼을 눌러주세요.
        </div>
      )}
    </div>
  );
}
