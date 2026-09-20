import type { MatchDetailTab } from "@/types/match";
import {
  ClipboardList,
  Info,
  LayoutGrid,
  NotebookPen,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const tabs: {
  id: MatchDetailTab;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "info", label: "정보", icon: Info },
  { id: "vote", label: "투표", icon: Users },
  { id: "attendance", label: "출석", icon: NotebookPen },
  { id: "tactics", label: "전술", icon: LayoutGrid },
  { id: "record", label: "기록", icon: ClipboardList },
  { id: "mvp", label: "MVP", icon: Trophy },
];

interface MatchDetailTabsProps {
  activeTab: MatchDetailTab;
  onChange: (tab: MatchDetailTab) => void;
}

export default function MatchDetailTabs({
  activeTab,
  onChange,
}: Readonly<MatchDetailTabsProps>) {
  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="grid grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "relative flex flex-col items-center justify-center gap-1 px-1 py-3 text-[11px] transition sm:gap-1.5 sm:px-2 sm:text-xs",
                isActive
                  ? "text-stone-900"
                  : "text-stone-400 hover:bg-stone-50/60 hover:text-stone-700",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              <span>{tab.label}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-600 sm:inset-x-4"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
