import type { PaymentStatusRow, PaymentSummary } from "@/types/finance";
import FinancePaymentSummaryCard from "./FinancePaymentSummaryCard";
import FinancePaymentHeader from "./FinancePaymentHeader";
import FinancePaymentStatusGroup from "./FinancePaymentStatusGroup";

interface FinancePaymentsSectionProps {
  canManage: boolean;
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
  canManage,
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
      <FinancePaymentHeader
        currentMonthLabel={currentMonthLabel}
        onMoveMonth={onMoveMonth}
      />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          납부 현황은 조회할 수 있고, 납부 상태 변경은 운영진만 할 수 있어요.
        </div>
      )}
      <FinancePaymentStatusGroup
        canManage={canManage}
        title="미납"
        count={paymentSummary.unpaidCount}
        tone="unpaid"
        isOpen={isUnpaidOpen}
        onToggle={onToggleUnpaid}
        rows={unpaidPaymentRows}
        onChangePaymentStatus={onChangePaymentStatus}
      />

      <FinancePaymentStatusGroup
        canManage={canManage}
        title="납부 완료"
        count={paymentSummary.paidCount}
        tone="paid"
        isOpen={isPaidOpen}
        onToggle={onTogglePaid}
        rows={paidPaymentRows}
        onChangePaymentStatus={onChangePaymentStatus}
      />
    </div>
  );
}
