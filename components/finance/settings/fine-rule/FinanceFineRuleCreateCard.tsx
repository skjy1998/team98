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
          <p className="text-base font-semibold text-stone-900 sm:text-lg">
            벌금 규칙
          </p>
          <p className="mt-0.5 text-xs text-stone-400 sm:mt-1 sm:text-sm">
            완료된 경기의 출석 기록을 기준으로 벌금 대상을 계산합니다.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            disabled={createState.isSubmitting}
            onClick={createState.onOpenAddFineRule}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:opacity-60 sm:h-11 sm:gap-2 sm:px-4 sm:text-base"
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
