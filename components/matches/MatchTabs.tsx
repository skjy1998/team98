import { MatchTab } from "@/types/match";

interface MatchTabProps {
  activeTab: MatchTab;
  onTabChange: (tab: MatchTab) => void;
}

export default function MatchTabs({
  activeTab,
  onTabChange,
}: Readonly<MatchTabProps>) {
  return (
    <div className="grid grid-cols-3">
      {(["기록", "라인업", "통계"] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`border-b-2 py-4 text-sm font-bold transition ${
              isActive
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
