import type { FinancePaymentStatusGroupState } from "@/types/finance-ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import FinancePaymentStatusItem from "./FinancePaymentStatusItem";

interface FinancePaymentStatusGroupProps {
  canManage: boolean;
  groupState: FinancePaymentStatusGroupState;
  onChangePaymentStatus: (
    playerId: string,
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => Promise<boolean>;
  selectable?: boolean;
  selectedPlayerIds?: string[];
  onTogglePlayer?: (playerId: string) => void;
}

export default function FinancePaymentStatusGroup({
  canManage,
  groupState,
  onChangePaymentStatus,
  selectable = false,
  selectedPlayerIds = [],
  onTogglePlayer,
}: Readonly<FinancePaymentStatusGroupProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={groupState.onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-stone-900">
            {groupState.title}
          </h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              groupState.tone === "paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {groupState.count}명
          </span>
        </div>

        {groupState.isOpen ? (
          <ChevronUp className="h-5 w-5 text-stone-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-stone-400" />
        )}
      </button>

      {groupState.isOpen && (
        <div className="divide-y divide-stone-200 border-t border-stone-200">
          {groupState.rows.map((row) => (
            <FinancePaymentStatusItem
              key={row.playerId}
              row={row}
              canManage={canManage}
              onChangePaymentStatus={onChangePaymentStatus}
              selectable={selectable}
              selected={selectedPlayerIds.includes(row.playerId)}
              onToggleSelect={() => onTogglePlayer?.(row.playerId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
