import type { PaymentStatusRow } from "@/types/finance";

interface FinancePaymentStatusItemProps {
  canManage: boolean;
  row: PaymentStatusRow;
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export default function FinancePaymentStatusItem({
  canManage,
  row,
  onChangePaymentStatus,
}: Readonly<FinancePaymentStatusItemProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-base font-semibold text-stone-900">
            {row.playerName}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              row.status === "paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {row.status === "paid" ? "납부" : "미납"}
          </span>
        </div>

        <select
          value={row.status}
          onChange={(event) =>
            onChangePaymentStatus(
              row.playerName,
              event.target.value as "paid" | "unpaid",
            )
          }
          disabled={!canManage}
          className={`h-10 min-w-[110px] rounded-xl border px-4 text-sm outline-none ${
            canManage
              ? "border-stone-200 bg-white text-stone-700 focus:border-orange-300"
              : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          }`}
        >
          <option value="unpaid">미납</option>
          <option value="paid">납부 완료</option>
        </select>
      </div>
    </div>
  );
}
