import type { MatchRecordEventType, MatchType } from "@/types/match";

interface MatchRecordScoreActionsProps {
  matchType: MatchType;
  isAddingEvent: boolean;
  onAddEvent: (type: MatchRecordEventType) => Promise<void>;
}

export default function MatchRecordScoreActions({
  matchType,
  isAddingEvent,
  onAddEvent,
}: Readonly<MatchRecordScoreActionsProps>) {
  const isSelfMatch = matchType === "자체전";
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
        경기 스코어 반영
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
        <button
          type="button"
          disabled={isAddingEvent}
          onClick={() => void onAddEvent("goal")}
          className="h-12 rounded-xl bg-emerald-100 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-lg"
        >
          {isAddingEvent ? "추가 중..." : isSelfMatch ? "+ A팀 득점" : "+ 득점"}
        </button>

        <button
          type="button"
          disabled={isAddingEvent}
          onClick={() => void onAddEvent("concede")}
          className="h-12 rounded-xl bg-rose-100 text-sm font-semibold text-rose-600 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-lg"
        >
          {isAddingEvent ? "추가 중..." : isSelfMatch ? "+ B팀 득점" : "+ 실점"}
        </button>
      </div>

      <p className="mt-3 text-xs text-stone-400 sm:text-sm">
        {isSelfMatch
          ? "A팀과 B팀의 득점을 추가하면 상단 전광판 점수에 바로 반영돼요."
          : "득점과 실점을 추가하면 상단 전광판 점수에도 바로 반영돼요."}
      </p>
    </section>
  );
}
