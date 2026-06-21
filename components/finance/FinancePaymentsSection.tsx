import { PaymentStatusRow, PaymentSummary } from "@/types/finance";

interface FinancePaymentsSectionProps {
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
  paymentSummary: PaymentSummary;
  unpaidPaymentRows: PaymentStatusRow[];
  paidPaymentRows: PaymentStatusRow[];
  isUnpaidOpen: boolean;
  onToggleUnpaid: () => void;
  isPaidOpen: boolean;
  onTogglePaid: () => void;
  onChangePaymentStatus: (
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => void;
}

export default function FinancePaymentsSection({
  currentMonthLabel,
  onMoveMonth,
  paymentSummary,
  unpaidPaymentRows,
  paidPaymentRows,
  isUnpaidOpen,
  onToggleUnpaid,
  isPaidOpen,
  onTogglePaid,
  onChangePaymentStatus,
}: Readonly<FinancePaymentsSectionProps>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-stone-900">납부 현황</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMoveMonth("prev")}
            className="rounded-lg px-2 py-1 text-stone-500 transition hover:bg-stone-50"
          >
            &lt;
          </button>

          <p className="min-w-16 text-center text-sm font-semibold text-stone-900">
            {currentMonthLabel}
          </p>

          <button
            type="button"
            onClick={() => onMoveMonth("next")}
            className="rounded-lg px-2 py-1 text-stone-500 transition hover:bg-stone-50"
          >
            &gt;
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-stone-500">납부 통계</p>

        <div className="mt-5 flex items-center gap-4">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-stone-900">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${paymentSummary.paidRate}%` }}
            />
          </div>
          <p className="text-3xl font-semibold text-stone-900">
            {paymentSummary.paidRate}%
          </p>
        </div>

        <p className="mt-4 text-base font-medium">
          <span className="text-emerald-600">
            납부 {paymentSummary.paidCount}
          </span>
          <span className="mx-2 text-stone-300">·</span>
          <span className="text-rose-500">
            미납 {paymentSummary.unpaidCount}
          </span>
        </p>
      </section>

      <section className="space-y-3">
        <button
          type="button"
          onClick={onToggleUnpaid}
          className="flex w-full items-center justify-between rounded-xl bg-rose-50/70 px-4 py-3 text-left"
        >
          <p className="text-sm font-semibold text-rose-500">
            미납 ({paymentSummary.unpaidCount}명)
          </p>
          <span className="text-rose-400">{isUnpaidOpen ? "⌃" : "⌄"}</span>
        </button>
        {isUnpaidOpen &&
          unpaidPaymentRows.map((row) => (
            <div
              key={row.playerId}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm"
            >
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
          ))}
      </section>
      <section className="space-y-3">
        <button
          type="button"
          onClick={onTogglePaid}
          className="flex w-full items-center justify-between rounded-xl bg-emerald-50/70 px-4 py-3 text-left"
        >
          <p className="text-sm font-semibold text-emerald-600">
            납부 완료 ({paymentSummary.paidCount}명)
          </p>
          <span className="text-emerald-400">{isPaidOpen ? "⌃" : "⌄"}</span>
        </button>
        {isPaidOpen &&
          paidPaymentRows.map((row) => (
            <div
              key={row.playerId}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm"
            >
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
          ))}
      </section>
    </div>
  );
}
