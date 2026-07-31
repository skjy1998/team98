import type { FinanceFineRuleListState } from "@/types/finance-ui";
import FinanceFineRuleList from "./FinanceFineRuleList";

interface FinanceFineRuleListSectionProps {
  canManage: boolean;
  listState: FinanceFineRuleListState;
}

export default function FinanceFineRuleListSection({
  canManage,
  listState,
}: Readonly<FinanceFineRuleListSectionProps>) {
  return (
    <FinanceFineRuleList
      canManage={canManage}
      isSubmitting={listState.isSubmitting}
      fineRules={listState.fineRules}
      fineTriggerLabel={listState.fineTriggerLabel}
      onDeleteFineRule={listState.onDeleteFineRule}
    />
  );
}
