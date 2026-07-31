import type { FinanceCreateFineRuleState } from "@/types/finance-ui";
import FinanceFineRuleCreateForm from "./FinanceFineRuleCreateForm";

interface FinanceFineRuleCreateCardProps {
  canManage: boolean;
  createState: FinanceCreateFineRuleState;
}

export default function FinanceFineRuleCreateCard({
  canManage,
  createState,
}: Readonly<FinanceFineRuleCreateCardProps>) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-stone-900">벌금 규칙</p>
          <p className="mt-1 text-sm text-stone-400">
            완료된 경기의 출석 기록을 기준으로 벌금 대상을 계산합니다.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            disabled={createState.isSubmitting}
            onClick={createState.onOpenAddFineRule}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + 추가
          </button>
        )}
      </div>
      {canManage && createState.isAddingFineRule && (
        <FinanceFineRuleCreateForm
          fineRuleName={createState.fineRuleName}
          isSubmitting={createState.isSubmitting}
          onChangeFineRuleName={createState.onChangeFineRuleName}
          fineRuleTrigger={createState.fineRuleTrigger}
          onChangeFineRuleTrigger={createState.onChangeFineRuleTrigger}
          fineRuleAmount={createState.fineRuleAmount}
          onChangeFineRuleAmount={createState.onChangeFineRuleAmount}
          onCancel={createState.onCancelFineRule}
          onSave={createState.onSaveFineRule}
        />
      )}
    </>
  );
}
