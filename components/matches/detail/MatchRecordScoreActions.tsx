import type { MatchRecordEventType } from "@/types/match";

interface MatchRecordScoreActionsProps {
  onAddEvent: (type: MatchRecordEventType) => Promise<void>;
}

export default function MatchRecordScoreActions({
  onAddEvent,
}: Readonly<MatchRecordScoreActionsProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">경기 스코어 반영</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => void onAddEvent("goal")}
          className="h-16 rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-700 transition hover:bg-emerald-200"
        >
          + 득점
        </button>

        <button
          type="button"
          onClick={() => void onAddEvent("concede")}
          className="h-16 rounded-xl bg-rose-100 text-lg font-semibold text-rose-600 transition hover:bg-rose-200"
        >
          + 실점
        </button>
      </div>

      <p className="mt-3 text-sm text-stone-400">
        득점과 실점을 추가하면 상단 전광판 점수에도 바로 반영돼요.
      </p>
    </section>
  );
}
