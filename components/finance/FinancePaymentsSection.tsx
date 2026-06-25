import { PaymentStatusRow, PaymentSummary } from "@/types/finance";
import FinancePaymentSummaryCard from "./FinancePaymentSummaryCard";
import FinancePaymentHeader from "./FinancePaymentHeader";
import FinancePaymentStatusGroup from "./FinancePaymentStatusGroup";

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
      <FinancePaymentHeader
        currentMonthLabel={currentMonthLabel}
        onMoveMonth={onMoveMonth}
      />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      <FinancePaymentStatusGroup
        title="미납"
        count={paymentSummary.unpaidCount}
        tone="unpaid"
        isOpen={isUnpaidOpen}
        onToggle={onToggleUnpaid}
        rows={unpaidPaymentRows}
        onChangePaymentStatus={onChangePaymentStatus}
      />

      <FinancePaymentStatusGroup
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
