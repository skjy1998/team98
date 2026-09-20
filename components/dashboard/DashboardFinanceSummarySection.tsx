import Link from "next/link";

interface DashboardFinanceSummarySectionProps {
  totalBalance: number;
  paidRate: number;
  paidCount: number;
  unpaidCount: number;
}

export default function DashboardFinanceSummarySection({
  totalBalance,
  paidRate,
  paidCount,
  unpaidCount,
}: Readonly<DashboardFinanceSummarySectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">회비 현황</span>
        <Link
          className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
          href="/finance"
        >
          회비 보기
        </Link>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold text-stone-400 sm:text-sm">
          현재 잔액
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          {totalBalance.toLocaleString()}원
        </p>

        <div className="mt-4 sm:mt-5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-stone-500">이번 달 납부율</span>
            <span className="font-semibold text-stone-900">{paidRate}%</span>
          </div>

          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-100 sm:h-3">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${paidRate}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-stone-500 sm:text-sm">
            납부 {paidCount}명 · 미납 {unpaidCount}명
          </p>
        </div>
      </div>
    </section>
  );
}
