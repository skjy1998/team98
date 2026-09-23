import { TeamEntryMode } from "@/types/team";
import { KeyRound, Plus } from "lucide-react";

interface TeamEntryModeSelectorProps {
  mode: TeamEntryMode;
  onChangeMode: (mode: TeamEntryMode) => void;
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

export default function TeamEntryModeSelector({
  mode,
  onChangeMode,
}: Readonly<TeamEntryModeSelectorProps>) {
  return (
    <div
      role="group"
      aria-label="팀 시작 방법"
      className="grid grid-cols-2 gap-2.5 sm:gap-4"
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
              "relative rounded-xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 sm:rounded-2xl sm:p-6",
              isSelected
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-stone-200 bg-white hover:border-stone-300",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl",
                isSelected
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-500",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>

            <span className="mt-3 block text-base font-black text-stone-900 sm:mt-5 sm:text-lg">
              {item.title}
            </span>

            <span className="mt-1.5 block text-xs leading-5 text-stone-500 sm:mt-2 sm:text-sm sm:leading-6">
              {item.description}
            </span>

            <span
              className={[
                "absolute right-3.5 top-3.5 h-2 w-2 rounded-full sm:right-5 sm:top-5 sm:h-2.5 sm:w-2.5",
                isSelected ? "bg-emerald-500" : "bg-stone-200",
              ].join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}
