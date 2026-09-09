import type { TeamSetupMode } from "@/hooks/team/useTeamSetup";
import { KeyRound, Plus } from "lucide-react";

interface TeamSetupModeSelectorProps {
  mode: TeamSetupMode;
  onChangeMode: (mode: TeamSetupMode) => void;
}

const modeItems = [
  {
    value: "create",
    title: "새 팀 만들기",
    description: "우리 팀을 만들고 일정과 선수 관리를 바로 시작합니다.",
    icon: Plus,
  },
  {
    value: "join",
    title: "기존 팀 참가하기",
    description: "전달받은 초대 코드를 입력해 팀에 합류합니다.",
    icon: KeyRound,
  },
] as const;

export default function TeamSetupModeSelector({
  mode,
  onChangeMode,
}: Readonly<TeamSetupModeSelectorProps>) {
  return (
    <div
      role="group"
      aria-label="팀 시작 방법"
      className="grid gap-4 md:grid-cols-2"
    >
      {modeItems.map((item) => {
        const Icon = item.icon;
        const isSelected = mode === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChangeMode(item.value)}
            aria-pressed={isSelected}
            className={[
              "relative rounded-2xl border p-6 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100",
              isSelected
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-stone-200 bg-white hover:border-stone-300",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-11 w-11 items-center justify-center rounded-xl",
                isSelected
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-500",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>

            <span className="mt-5 block text-lg font-black text-stone-900">
              {item.title}
            </span>

            <span className="mt-2 block text-sm leading-6 text-stone-500">
              {item.description}
            </span>

            <span
              className={[
                "absolute right-5 top-5 h-2.5 w-2.5 rounded-full",
                isSelected ? "bg-emerald-500" : "bg-stone-200",
              ].join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}
