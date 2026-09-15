import type { MatchDetailTab } from "@/types/match";
import {
  ClipboardList,
  Info,
  LayoutGrid,
  NotebookPen,
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
      <div className="grid grid-cols-3 md:grid-cols-5">
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
                "relative flex flex-col items-center justify-center gap-2 px-3 py-4 text-sm transition",
                isActive
                  ? "text-stone-900"
                  : "text-stone-400 hover:bg-stone-50/60 hover:text-stone-700",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{tab.label}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-emerald-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
