import type { FineRule } from "@/types/finance";
import { useState } from "react";

interface UseFinanceFineRuleStateParams {
  onAddFineRule: (nextFineRule: FineRule) => Promise<void>;
  onDeleteFineRule: (fineRuleId: string) => void;
}

export function useFinanceFineRuleState({
  onAddFineRule,
  onDeleteFineRule,
}: Readonly<UseFinanceFineRuleStateParams>) {
  const [isAddingFineRule, setIsAddingFineRule] = useState(false);
  const [fineRuleName, setFineRuleName] = useState("");
  const [fineRuleTrigger, setFineRuleTrigger] =
    useState<FineRule["trigger"]>("late");
  const [fineRuleAmount, setFineRuleAmount] = useState(5000);

  const handleCancelFineRule = () => {
    setIsAddingFineRule(false);
    setFineRuleName("");
    setFineRuleTrigger("late");
    setFineRuleAmount(5000);
  };

  const handleSaveFineRule = async () => {
    if (!fineRuleName.trim() || fineRuleAmount <= 0) {
      return;
    }

    onAddFineRule({
      id: crypto.randomUUID(),
      name: fineRuleName.trim(),
      trigger: fineRuleTrigger,
      amount: fineRuleAmount,
    });

    handleCancelFineRule();
  };

  const handleDeleteFineRule = (ruleId: string) => {
    onDeleteFineRule(ruleId);
  };

  return {
    isAddingFineRule,
    setIsAddingFineRule,
    fineRuleName,
    setFineRuleName,
    fineRuleTrigger,
    setFineRuleTrigger,
    fineRuleAmount,
    setFineRuleAmount,
    handleCancelFineRule,
    handleSaveFineRule,
    handleDeleteFineRule,
  };
}
