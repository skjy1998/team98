interface FinanceSummaryCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyFee: number;
}

export default function FinanceSummaryCard({
  totalBalance,
  totalIncome,
  totalExpense,
  monthlyFee,
}: Readonly<FinanceSummaryCardProps>) {
  const summaryItems = [
    {
      label: "이번 달 입금",
      value: totalIncome,
      valueClassName: "text-emerald-600",
    },
    {
      label: "이번 달 지출",
      value: totalExpense,
      valueClassName: "text-rose-600",
    },
    {
      label: "회비 금액",
      value: monthlyFee,
      valueClassName: "text-stone-600",
    },
  ];
  return (
    <section className="rounded-xl border border-orange-100 bg-orange-50/40 p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">현재 총 잔액</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight text-orange-500">
            {totalBalance.toLocaleString()}원
          </h2>
          <p className="mt-3 text-sm text-stone-400">
            입금과 지출을 반영한 현재 팀 재정 잔액
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-stone-400">{item.label}</p>
              <p
                className={`mt-2 text-2xl font-semibold ${item.valueClassName}`}
              >
                {item.value.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
