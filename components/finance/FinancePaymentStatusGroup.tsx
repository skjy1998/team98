import type { PaymentStatusRow } from "@/types/finance";
import FinancePaymentStatusItem from "./FinancePaymentStatusItem";

interface FinancePaymentStatusGroupProps {
  canManage: boolean;
  title: string;
  count: number;
  tone: "paid" | "unpaid";
  isOpen: boolean;
  onToggle: () => void;
  rows: PaymentStatusRow[];
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export default function FinancePaymentStatusGroup({
  canManage,
  title,
  count,
  tone,
  isOpen,
  onToggle,
  rows,
  onChangePaymentStatus,
}: Readonly<FinancePaymentStatusGroupProps>) {
  const headerClassName =
    tone === "paid"
      ? "bg-emerald-50/70 text-emerald-600"
      : "bg-rose-50/70 text-rose-500";

  const iconClassName = tone === "paid" ? "text-emerald-400" : "text-rose-400";

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${headerClassName}`}
      >
        <p className="text-sm font-semibold">
          {title} ({count}명)
        </p>
        <span className={iconClassName}>{isOpen ? "⌃" : "⌄"}</span>
      </button>
      {isOpen &&
        rows.map((row) => (
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
