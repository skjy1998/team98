import type { SettingsTab } from "@/types/settings";
import { CalendarRange, Settings2, UserRound } from "lucide-react";
import type { ComponentType } from "react";

interface SettingsTabProps {
  activeTab: SettingsTab;
  onChangeTab: (tab: SettingsTab) => void;
}

const tabs: Array<{
  id: SettingsTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "profile", label: "내 설정", icon: UserRound },
  { id: "team", label: "팀 설정", icon: Settings2 },
  { id: "season", label: "시즌 관리", icon: CalendarRange },
];

export default function SettingsTabs({
  activeTab,
  onChangeTab,
}: Readonly<SettingsTabProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white">
      <div className="grid grid-cols-3 border-b border-stone-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={[
                "flex items-center justify-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition",
                isActive
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-400 hover:text-stone-700",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
