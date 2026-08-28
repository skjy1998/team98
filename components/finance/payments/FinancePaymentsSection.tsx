import FinancePaymentSummaryCard from "./FinancePaymentSummaryCard";
import FinancePaymentHeader from "./FinancePaymentHeader";
import FinancePaymentStatusGroup from "./FinancePaymentStatusGroup";
import FinanceReadonlyNotice from "../FinanceReadonlyNotice";
import type { FinancePaymentsSectionProps } from "@/types/finance-ui";
import { useFinancePaymentSelection } from "@/hooks/finance/useFinancePaymentSelection";

export default function FinancePaymentsSection({
  canManage,
  headerState,
  paymentSummary,
  unpaidGroupState,
  paidGroupState,
  onChangePaymentStatus,
  onBulkMarkPaid,
}: Readonly<FinancePaymentsSectionProps>) {
  const {
    selectedPlayerIds,
    selectedCount,
    isAllSelected,
    isSubmitting,
    handleTogglePlayer,
    handleToggleSelectAll,
    handleBulkSubmit,
    handleChangePaymentStatus,
    handleMoveMonth,
  } = useFinancePaymentSelection({
    unpaidRows: unpaidGroupState.rows,
    onChangePaymentStatus,
    onBulkMarkPaid,
    onMoveMonth: headerState.onMoveMonth,
  });

  return (
    <div className="space-y-6">
      <FinancePaymentHeader {...headerState} onMoveMonth={handleMoveMonth} />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      {!canManage && (
        <FinanceReadonlyNotice message="납부 현황은 조회할 수 있고, 납부 상태 변경은 운영진만 할 수 있어요." />
      )}
      {canManage && unpaidGroupState.rows.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                {isAllSelected ? "전체 해제" : "전체 선택"}
              </button>

              <span className="text-sm text-stone-500">
                선택 {selectedCount}명
              </span>
            </div>

            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={selectedCount === 0 || isSubmitting}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "처리중..." : "선택 인원 납부 처리"}
            </button>
          </div>
        </section>
      )}
      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={unpaidGroupState}
        onChangePaymentStatus={handleChangePaymentStatus}
        selectable={canManage}
        selectedPlayerIds={selectedPlayerIds}
        onTogglePlayer={handleTogglePlayer}
      />

      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={paidGroupState}
        onChangePaymentStatus={handleChangePaymentStatus}
      />
    </div>
  );
}
