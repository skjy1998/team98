import type { FineRule } from "@/types/finance";
import FinanceFineRuleCreateForm from "./FinanceFineRuleCreateForm";
import FinanceFineRuleList from "./FinanceFineRuleList";

interface FinanceFineRuleSectionProps {
  canManage: boolean;
  fineRules: FineRule[];
  fineTriggerLabel: Record<string, string>;

  isAddingFineRule: boolean;
  onOpenAddFineRule: () => void;

  fineRuleName: string;
  onChangeFineRuleName: (value: string) => void;
  fineRuleTrigger: FineRule["trigger"];
  onChangeFineRuleTrigger: (value: FineRule["trigger"]) => void;
  fineRuleAmount: number;
  onChangeFineRuleAmount: (value: number) => void;
  onCancelFineRule: () => void;
  onSaveFineRule: () => void;

  onDeleteFineRule: (ruleId: string) => void;
}

export default function FinanceFineRuleSection({
  canManage,
  fineRules,
  fineTriggerLabel,
  isAddingFineRule,
  onOpenAddFineRule,
  fineRuleName,
  onChangeFineRuleName,
  fineRuleTrigger,
  onChangeFineRuleTrigger,
  fineRuleAmount,
  onChangeFineRuleAmount,
  onCancelFineRule,
  onSaveFineRule,
  onDeleteFineRule,
}: Readonly<FinanceFineRuleSectionProps>) {
  return (
    <section className="space-y-4">
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
            onClick={onOpenAddFineRule}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
          >
            + 추가
          </button>
        )}
      </div>

      {canManage && isAddingFineRule && (
        <FinanceFineRuleCreateForm
          fineRuleName={fineRuleName}
          onChangeFineRuleName={onChangeFineRuleName}
          fineRuleTrigger={fineRuleTrigger}
          onChangeFineRuleTrigger={onChangeFineRuleTrigger}
          fineRuleAmount={fineRuleAmount}
          onChangeFineRuleAmount={onChangeFineRuleAmount}
          onCancel={onCancelFineRule}
          onSave={onSaveFineRule}
        />
      )}

      <FinanceFineRuleList
        canManage={canManage}
        fineRules={fineRules}
        fineTriggerLabel={fineTriggerLabel}
        onDeleteFineRule={onDeleteFineRule}
      />
    </section>
  );
}
