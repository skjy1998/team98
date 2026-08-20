import { useConfirmStore } from "@/stores/confirm-store";
import type { FineRule } from "@/types/finance";
import { useRef, useState } from "react";

interface UseFinanceFineRuleStateParams {
  onAddFineRule: (nextFineRule: FineRule) => Promise<boolean>;
  onDeleteFineRule: (fineRuleId: string) => Promise<boolean>;
}

export function useFinanceFineRuleState({
  onAddFineRule,
  onDeleteFineRule,
}: Readonly<UseFinanceFineRuleStateParams>) {
  const confirm = useConfirmStore((state) => state.confirm);

  const [isAddingFineRule, setIsAddingFineRule] = useState(false);
  const [fineRuleName, setFineRuleName] = useState("");
  const [fineRuleTrigger, setFineRuleTrigger] =
    useState<FineRule["trigger"]>("late");
  const [fineRuleAmount, setFineRuleAmount] = useState(5000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const runFineRuleMutation = async (mutation: () => Promise<boolean>) => {
    if (isSubmittingRef.current) return false;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      return await mutation();
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

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

    const success = await runFineRuleMutation(() =>
      onAddFineRule({
        id: crypto.randomUUID(),
        name: fineRuleName.trim(),
        trigger: fineRuleTrigger,
        amount: fineRuleAmount,
      }),
    );

    if (!success) return;

    handleCancelFineRule();
  };

  const handleDeleteFineRule = async (ruleId: string) => {
    if (isSubmittingRef.current) return;

    const confirmed = await confirm({
      title: "벌금 규칙 삭제",
      description:
        "이 벌금 규칙을 삭제할까요? 이미 부과된 벌금 내역은 유지됩니다.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    await runFineRuleMutation(() => onDeleteFineRule(ruleId));
  };

  return {
    isSubmitting,
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
