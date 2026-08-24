export type MatchAttendanceMode = "assignment" | "attendance";

interface MatchAttendanceModeTabsProps {
  activeMode: MatchAttendanceMode;
  onChangeMode: (mode: MatchAttendanceMode) => void;
}

const modeOptions: {
  value: MatchAttendanceMode;
  label: string;
}[] = [
  {
    value: "assignment",
    label: "팀 배정",
  },
  {
    value: "attendance",
    label: "출석 체크",
  },
];

export default function MatchAttendanceModeTabs({
  activeMode,
  onChangeMode,
}: Readonly<MatchAttendanceModeTabsProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-stone-100 p-1">
      <div className="grid grid-cols-2 gap-1">
        {modeOptions.map((option) => {
          const isActive = activeMode === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeMode(option.value)}
              className={[
                "rounded-lg px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-stone-500 hover:bg-white/60 hover:text-stone-700",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
