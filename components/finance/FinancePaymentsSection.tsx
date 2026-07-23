import FinancePaymentSummaryCard from "./FinancePaymentSummaryCard";
import FinancePaymentHeader from "./FinancePaymentHeader";
import FinancePaymentStatusGroup from "./FinancePaymentStatusGroup";
import FinanceReadonlyNotice from "./FinanceReadonlyNotice";
import type { FinancePaymentsSectionProps } from "@/types/finance-ui";

export default function FinancePaymentsSection({
  canManage,
  headerState,
  paymentSummary,
  unpaidGroupState,
  paidGroupState,
  onChangePaymentStatus,
}: Readonly<FinancePaymentsSectionProps>) {
  return (
    <div className="space-y-6">
      <FinancePaymentHeader {...headerState} />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      {!canManage && (
        <FinanceReadonlyNotice message="납부 현황은 조회할 수 있고, 납부 상태 변경은 운영진만 할 수 있어요." />
      )}
      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={unpaidGroupState}
        onChangePaymentStatus={onChangePaymentStatus}
      />

      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={paidGroupState}
        onChangePaymentStatus={onChangePaymentStatus}
      />
    </div>
  );
}
