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
  unconfiguredGroupState,
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
    <div className="space-y-4 sm:space-y-6">
      <FinancePaymentHeader {...headerState} onMoveMonth={handleMoveMonth} />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      {!canManage && (
        <FinanceReadonlyNotice message="납부 현황은 조회할 수 있고, 납부 상태 변경은 운영진만 할 수 있어요." />
      )}
      {canManage &&
        unpaidGroupState.rows.some((row) => row.isFeeConfigured) && (
          <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="text-sm text-stone-500">
                선택 {selectedCount}명
              </span>

              <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 sm:w-auto sm:py-2"
                >
                  {isAllSelected ? "전체 해제" : "전체 선택"}
                </button>

                <button
                  type="button"
                  onClick={handleBulkSubmit}
                  disabled={selectedCount === 0 || isSubmitting}
                  className="w-full rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto sm:px-4 sm:py-2"
                >
                  {isSubmitting ? "처리중..." : "선택 납부 처리"}
                </button>
              </div>
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

      {unconfiguredGroupState.rows.length > 0 && (
        <FinancePaymentStatusGroup
          canManage={canManage}
          groupState={unconfiguredGroupState}
          onChangePaymentStatus={handleChangePaymentStatus}
        />
      )}

      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={paidGroupState}
        onChangePaymentStatus={handleChangePaymentStatus}
      />
    </div>
  );
}
