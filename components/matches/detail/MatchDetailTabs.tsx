import {
  ClipboardList,
  Info,
  LayoutGrid,
  NotebookPen,
  Users,
} from "lucide-react";

export type MatchDetailTab = "info" | "vote" | "tactics" | "record" | "review";

const tabs: {
  id: MatchDetailTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "info", label: "정보", icon: Info },
  { id: "vote", label: "출석", icon: Users },
  { id: "tactics", label: "전술", icon: LayoutGrid },
  { id: "record", label: "기록", icon: ClipboardList },
  { id: "review", label: "후기", icon: NotebookPen },
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
    <section className="rounded-xl border border-stone-200 bg-white">
      <div className="grid grid-cols-3 border-b border-stone-200 md:grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "flex flex-col items-center justify-center gap-2 px-3 py-4 text-sm transition",
                isActive
                  ? "border-b-2 border-emerald-600 text-stone-900"
                  : "border-b-2 border-transparent text-stone-400 hover:text-stone-700",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
