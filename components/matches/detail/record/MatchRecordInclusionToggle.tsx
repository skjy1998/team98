interface MatchRecordInclusionToggleProps {
  enabled: boolean;
  disabled: boolean;
  onChange: () => void;
}

export default function MatchRecordInclusionToggle({
  enabled,
  disabled,
  onChange,
}: Readonly<MatchRecordInclusionToggleProps>) {
  return (
    <section className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-stone-800">통계 반영</p>
        <p className="mt-1 text-sm text-stone-400">
          팀 전적과 선수 개인 기록 통계에 이 경기를 포함해요.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="경기 통계 반영 여부"
        disabled={disabled}
        onClick={onChange}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition",
          enabled ? "bg-emerald-600" : "bg-stone-300",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
            enabled ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </section>
  );
}
