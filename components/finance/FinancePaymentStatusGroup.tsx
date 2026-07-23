import FinancePaymentStatusItem from "./FinancePaymentStatusItem";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FinancePaymentStatusGroupState } from "@/types/finance-ui";

interface FinancePaymentStatusGroupProps {
  canManage: boolean;
  groupState: FinancePaymentStatusGroupState;
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export default function FinancePaymentStatusGroup({
  canManage,
  groupState,
  onChangePaymentStatus,
}: Readonly<FinancePaymentStatusGroupProps>) {
  const headerClassName =
    groupState.tone === "paid"
      ? "bg-emerald-50/70 text-emerald-600"
      : "bg-rose-50/70 text-rose-500";

  const iconClassName =
    groupState.tone === "paid" ? "text-emerald-400" : "text-rose-400";

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={groupState.onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${headerClassName}`}
      >
        <p className="text-sm font-semibold">
          {groupState.title} ({groupState.count}명)
        </p>
        <span className={iconClassName}>
          {groupState.isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      {groupState.isOpen &&
        groupState.rows.map((row) => (
          <FinancePaymentStatusItem
            key={row.playerId}
            row={row}
            onChangePaymentStatus={onChangePaymentStatus}
            canManage={canManage}
          />
        ))}
    </section>
  );
}
