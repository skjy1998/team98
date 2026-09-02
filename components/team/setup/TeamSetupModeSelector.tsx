import type { TeamSetupMode } from "@/hooks/team/useTeamSetup";

interface TeamSetupModeSelectorProps {
  mode: TeamSetupMode;
  onChangeMode: (mode: TeamSetupMode) => void;
}

const modeItems = [
  {
    value: "create",
    symbol: "+",
    title: "새 팀 만들기",
    description: "우리 팀을 직접 생성하고 팀 이름과 기본 정보를 설정해요.",
    activeClassName: "border-emerald-300 bg-emerald-50",
    symbolClassName: "bg-white text-emerald-600",
  },
  {
    value: "join",
    symbol: "#",
    title: "팀 참가하기",
    description: "초대 코드를 입력해 기존 팀에 참가해요.",
    activeClassName: "border-sky-300 bg-sky-50",
    symbolClassName: "bg-white text-sky-600",
  },
] as const;

export default function TeamSetupModeSelector({
  mode,
  onChangeMode,
}: Readonly<TeamSetupModeSelectorProps>) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {modeItems.map((item) => {
        const isSelected = mode === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChangeMode(item.value)}
            aria-pressed={isSelected}
            className={[
              "rounded-xl border p-6 text-left shadow-sm transition",
              isSelected
                ? item.activeClassName
                : "border-stone-200 bg-white hover:bg-stone-50",
            ].join(" ")}
          >
            <div className="space-y-3">
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold shadow-sm",
                  isSelected
                    ? item.symbolClassName
                    : "bg-stone-100 text-stone-600",
                ].join(" ")}
              >
                {item.symbol}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </section>
  );
}
