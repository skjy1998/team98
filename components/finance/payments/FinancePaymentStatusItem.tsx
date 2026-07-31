import type { PaymentStatusRow } from "@/types/finance";

interface FinancePaymentStatusItemProps {
  row: PaymentStatusRow;
  canManage: boolean;
  onChangePaymentStatus: (
    playerId: string,
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => Promise<boolean>;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export default function FinancePaymentStatusItem({
  row,
  canManage,
  onChangePaymentStatus,
  selectable = false,
  selected = false,
  onToggleSelect,
}: Readonly<FinancePaymentStatusItemProps>) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
          />
        )}

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-stone-900">
            {row.playerName}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {row.status === "paid" ? row.paidAt : "아직 납부하지 않았어요."}
          </p>
        </div>
      </div>

      {canManage ? (
        <select
          value={row.status}
          onChange={(event) =>
            onChangePaymentStatus(
              row.playerId,
              row.playerName,
              event.target.value as "paid" | "unpaid",
            )
          }
          className="min-w-[110px] rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 outline-none focus:border-orange-300"
        >
          <option value="unpaid">미납</option>
          <option value="paid">납부 완료</option>
        </select>
      ) : (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            row.status === "paid"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {row.status === "paid" ? "납부 완료" : "미납"}
        </span>
      )}
    </div>
  );
}
