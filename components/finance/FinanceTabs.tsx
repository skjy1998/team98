import type { FinanceTab } from "@/types/finance";
import type { ComponentType } from "react";
import { Coins, CreditCard, Settings } from "lucide-react";

const tabs: {
  id: FinanceTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "transactions", label: "입출금", icon: Coins },
  { id: "payments", label: "납부현황", icon: CreditCard },
  { id: "settings", label: "설정", icon: Settings },
];

interface FinanceTabsProps {
  activeTab: FinanceTab;
  onChangeTab: (tab: FinanceTab) => void;
}

export default function FinanceTabs({
  activeTab,
  onChangeTab,
}: Readonly<FinanceTabsProps>) {
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
                "flex flex-col items-center justify-center gap-2 px-3 py-4 text-sm transition",
                isActive
                  ? "border-b-2 border-orange-500 text-stone-900"
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
