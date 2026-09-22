import type { PaymentSummary } from "@/types/finance";

interface FinancePaymentSummaryCardProps {
  paymentSummary: PaymentSummary;
}

export default function FinancePaymentSummaryCard({
  paymentSummary,
}: Readonly<FinancePaymentSummaryCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm sm:p-5">
      <p className="text-xs font-medium text-stone-500 sm:text-sm">납부 통계</p>

      <div className="mt-3 flex items-center gap-3 sm:mt-5 sm:gap-4">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-200 sm:h-4">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${paymentSummary.paidRate}%` }}
          />
        </div>
        <p className="text-xl font-semibold text-stone-900 sm:text-3xl">
          {paymentSummary.paidRate}%
        </p>
      </div>

      <p className="mt-3 text-sm font-medium sm:mt-4 sm:text-base">
        <span className="text-emerald-600">
          납부 {paymentSummary.paidCount}
        </span>
        <span className="mx-2 text-stone-300">·</span>
        <span className="text-rose-500">미납 {paymentSummary.unpaidCount}</span>
      </p>
    </section>
  );
}
