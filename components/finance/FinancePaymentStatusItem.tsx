import { PaymentStatusRow } from "@/types/finance";

interface FinancePaymentStatusItemProps {
  row: PaymentStatusRow;
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export default function FinancePaymentStatusItem({
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
          value={row.status === "paid" ? "납부 완료" : "미납"}
          onChange={(event) =>
            onChangePaymentStatus(
              row.playerName,
              event.target.value === "납부 완료" ? "paid" : "unpaid",
            )
          }
          className="h-10 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none focus:border-orange-300"
        >
          <option>미납</option>
          <option>납부 완료</option>
        </select>
      </div>
    </div>
  );
}
