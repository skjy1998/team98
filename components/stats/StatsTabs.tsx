import type { StatsTab } from "@/types/stats";

interface StatsTabsProps {
  activeTab: StatsTab;
  onChangeTab: (tab: StatsTab) => void;
}

const statsTabs: Array<{
  key: StatsTab;
  label: string;
}> = [
  { key: "me", label: "내 기록" },
  { key: "team", label: "팀 기록" },
  { key: "ranking", label: "선수 랭킹" },
];

export default function StatsTabs({
  activeTab,
  onChangeTab,
}: Readonly<StatsTabsProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-1">
      <div className="grid grid-cols-3 gap-1">
        {statsTabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              className={`rounded-lg px-2 py-2.5 text-xs font-medium transition sm:px-4 sm:py-3 sm:text-sm ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
