import { getManualFineRules } from "@/lib/finance/finance-fine";
import { useToastStore } from "@/stores/toast-store";
import type { CreateFineChargeInput, FineRule } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useMemo, useRef, useState } from "react";

interface UseFinanceManualFineParams {
  fineRules: FineRule[];
  players: PlayerType[];
  createFineCharges: (inputs: CreateFineChargeInput[]) => Promise<boolean>;
}

export function useFinanceManualFine({
  fineRules,
  players,
  createFineCharges,
}: UseFinanceManualFineParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [ruleId, setRuleId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [matchId, setMatchId] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const rules = useMemo(() => getManualFineRules(fineRules), [fineRules]);

  const resetForm = () => {
    setRuleId("");
    setPlayerId("");
    setMatchId("");
    setReason("");
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    const selectedRule = rules.find((rule) => rule.id === ruleId);
    const selectedPlayer = players.find((player) => player.id === playerId);

    if (!selectedRule || !selectedPlayer) {
      showToast("기타 벌금 규칙과 선수를 선택해 주세요.", "info");
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      showToast("벌금 부과 사유를 입력해 주세요.", "info");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await createFineCharges([
        {
          matchId: matchId || undefined,
          playerId: selectedPlayer.id,
          ruleId: selectedRule.id,
          ruleName: selectedRule.name,
          trigger: selectedRule.trigger,
          amount: selectedRule.amount,
          description: `[etc] ${trimmedReason} (${selectedPlayer.name})`,
        },
      ]);

      if (!success) {
        showToast("기타 벌금 부과에 실패했어요.", "error");
        return;
      }

      resetForm();
      showToast("기타 벌금이 미납 상태로 부과됐어요.", "success");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    rules,
    isSubmitting,
    formState: {
      ruleId,
      onChangeRuleId: setRuleId,
      playerId,
      onChangePlayerId: setPlayerId,
      matchId,
      onChangeMatchId: setMatchId,
      reason,
      onChangeReason: setReason,
    },
    handleSubmit,
  };
}
