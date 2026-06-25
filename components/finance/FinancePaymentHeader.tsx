interface FinancePaymentHeaderProps {
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
}

export default function FinancePaymentHeader({
  currentMonthLabel,
  onMoveMonth,
}: Readonly<FinancePaymentHeaderProps>) {
  return (
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
  );
}
