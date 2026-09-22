interface FinanceSummaryCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  feeTypeCount: number;
}

export default function FinanceSummaryCard({
  totalBalance,
  totalIncome,
  totalExpense,
  feeTypeCount,
}: Readonly<FinanceSummaryCardProps>) {
  const summaryItems = [
    {
      label: "이번 달 입금",
      value: totalIncome,
      suffix: "원",
      valueClassName: "text-emerald-600",
    },
    {
      label: "이번 달 지출",
      value: totalExpense,
      suffix: "원",
      valueClassName: "text-rose-600",
    },
    {
      label: "회비 유형",
      value: feeTypeCount,
      suffix: "개",
      valueClassName: "text-stone-600",
    },
  ];
  return (
    <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 sm:text-sm">
            현재 총 잔액
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600 sm:mt-3 sm:text-5xl">
            {totalBalance.toLocaleString()}원
          </h2>
          <p className="mt-2 text-xs text-stone-400 sm:mt-3 sm:text-sm">
            입금과 지출을 반영한 현재 팀 재정 잔액
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs sm:gap-4 sm:text-sm">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-white px-2.5 py-3 shadow-sm sm:rounded-xl sm:px-5 sm:py-4"
            >
              <p className="text-stone-400">{item.label}</p>
              <p
                className={`mt-1.5 text-right text-sm font-semibold sm:mt-2 sm:text-2xl ${item.valueClassName}`}
              >
                {item.value.toLocaleString()}
                {item.suffix}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
