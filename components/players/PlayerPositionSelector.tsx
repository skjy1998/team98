import {
  playerDetailPositions,
  type PlayerDetailPosition,
} from "@/types/player";

interface PlayerPositionSelectorProps {
  detailPositions: PlayerDetailPosition[];
  onTogglePosition: (position: PlayerDetailPosition) => void;
  disabled?: boolean;
}

interface PositionSectionItem {
  value: PlayerDetailPosition;
  label: string;
}

interface PositionSection {
  title: string;
  dotClassName: string;
  activeClassName: string;
  items: PositionSectionItem[];
}

const positionSections: PositionSection[] = [
  {
    title: "골키퍼",
    dotClassName: "bg-amber-400",
    activeClassName: "border-amber-300 bg-amber-50 text-amber-700",
    items: [{ value: playerDetailPositions.GK[0], label: "골키퍼" }],
  },
  {
    title: "수비",
    dotClassName: "bg-blue-400",
    activeClassName: "border-blue-300 bg-blue-50 text-blue-700",
    items: [
      { value: "CB", label: "센터백" },
      { value: "LB", label: "레프트백" },
      { value: "RB", label: "라이트백" },
    ],
  },
  {
    title: "미드",
    dotClassName: "bg-emerald-400",
    activeClassName: "border-emerald-300 bg-emerald-50 text-emerald-700",
    items: [
      { value: "CDM", label: "수비형" },
      { value: "CM", label: "중앙" },
      { value: "CAM", label: "공격형" },
    ],
  },
  {
    title: "공격",
    dotClassName: "bg-rose-400",
    activeClassName: "border-rose-300 bg-rose-50 text-rose-700",
    items: [
      { value: "LW", label: "레프트 윙" },
      { value: "RW", label: "라이트 윙" },
      { value: "ST", label: "스트라이커" },
    ],
  },
];

export default function PlayerPositionSelector({
  detailPositions,
  onTogglePosition,
  disabled = false,
}: Readonly<PlayerPositionSelectorProps>) {
  return (
    <div className="space-y-2.5">
      {positionSections.map((section) => (
        <div
          key={section.title}
          className="rounded-[18px] border border-stone-200 bg-white px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${section.dotClassName}`}
            />
            <p className="text-sm font-semibold text-stone-900">
              {section.title}
            </p>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {section.items.map((item) => {
              const isActive = detailPositions.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onTogglePosition(item.value)}
                  className={[
                    "rounded-full border px-4 py-2 text-xs font-semibold transition",
                    isActive
                      ? section.activeClassName
                      : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                    disabled ? "cursor-not-allowed opacity-60" : "",
                  ].join(" ")}
                >
                  {item.value} {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
