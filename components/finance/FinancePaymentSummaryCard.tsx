import type { PaymentSummary } from "@/types/finance";

interface FinancePaymentSummaryCardProps {
  paymentSummary: PaymentSummary;
}

export default function FinancePaymentSummaryCard({
  paymentSummary,
}: Readonly<FinancePaymentSummaryCardProps>) {
  return (
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
        <span className="text-rose-500">미납 {paymentSummary.unpaidCount}</span>
      </p>
    </section>
  );
}
