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
        className="flex w-full items-center justify-between px-3.5 py-3 text-left sm:px-5 sm:py-4"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
            {groupState.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold sm:px-2.5 sm:py-1 ${
              groupState.tone === "paid"
                ? "bg-emerald-100 text-emerald-700"
                : groupState.tone === "unpaid"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {groupState.count}명
          </span>
        </div>

        {groupState.isOpen ? (
          <ChevronUp className="h-4 w-4 text-stone-400 sm:h-5 sm:w-5" />
        ) : (
          <ChevronDown className="h-4 w-4 text-stone-400 sm:h-5 sm:w-5" />
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
              selectable={selectable && row.isFeeConfigured}
              selected={selectedPlayerIds.includes(row.playerId)}
              onToggleSelect={() => onTogglePlayer?.(row.playerId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
