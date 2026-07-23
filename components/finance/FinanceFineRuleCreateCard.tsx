import { FinanceCreateFineRuleState } from "@/types/finance-ui";
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
            경기 완료 시 자동으로 벌금이 부과됩니다
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={createState.onOpenAddFineRule}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
          >
            + 추가
          </button>
        )}
      </div>
      {canManage && createState.isAddingFineRule && (
        <FinanceFineRuleCreateForm
          fineRuleName={createState.fineRuleName}
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
