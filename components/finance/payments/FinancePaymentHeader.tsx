import type { FinancePaymentsHeaderState } from "@/types/finance-ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FinancePaymentHeader({
  currentMonthLabel,
  onMoveMonth,
}: Readonly<FinancePaymentsHeaderState>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-semibold text-stone-900">납부 현황</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onMoveMonth("prev")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="min-w-16 text-center text-sm font-semibold text-stone-900">
          {currentMonthLabel}
        </p>

        <button
          type="button"
          onClick={() => onMoveMonth("next")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50"
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
