import type {
  FinanceCreateFineRuleState,
  FinanceFineRuleListState,
} from "@/types/finance-ui";
import FinanceFineRuleCreateCard from "./FinanceFineRuleCreateCard";
import FinanceFineRuleListSection from "./FinanceFineRuleListSection";

interface FinanceFineRuleSectionProps {
  canManage: boolean;
  createState: FinanceCreateFineRuleState;
  listState: FinanceFineRuleListState;
}

export default function FinanceFineRuleSection({
  canManage,
  createState,
  listState,
}: Readonly<FinanceFineRuleSectionProps>) {
  return (
    <section className="space-y-4">
      <FinanceFineRuleCreateCard
        canManage={canManage}
        createState={createState}
      />
      <FinanceFineRuleListSection canManage={canManage} listState={listState} />
    </section>
  );
}
