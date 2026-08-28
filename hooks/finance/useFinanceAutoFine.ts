import {
  getFineTargetsByMatch,
  getSelectableFineMatches,
} from "@/lib/finance/finance-fine";
import { useToastStore } from "@/stores/toast-store";
import type {
  CreateFineChargeInput,
  FineCharge,
  FineRule,
} from "@/types/finance";
import type { MatchItem } from "@/types/match";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type { MatchVotesByMatchId } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import { useMemo, useRef, useState } from "react";

interface UseFinanceAutoFineParams {
  fineCharges: FineCharge[];
  matches: MatchItem[];
  players: PlayerType[];
  votes: MatchVotesByMatchId;
  attendance: MatchAttendanceByMatchId;
  fineRules: FineRule[];
  createFineCharges: (inputs: CreateFineChargeInput[]) => Promise<boolean>;
}

export function useFinanceAutoFine({
  fineCharges,
  matches,
  players,
  votes,
  attendance,
  fineRules,
  createFineCharges,
}: UseFinanceAutoFineParams) {
  const showToast = useToastStore((state) => state.showToast);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const selectableMatches = useMemo(
    () => getSelectableFineMatches(matches),
    [matches],
  );

  const selectedMatch = useMemo(
    () => selectableMatches.find((match) => match.id === selectedMatchId),
    [selectableMatches, selectedMatchId],
  );

  const fineTargets = useMemo(() => {
    if (!selectedMatch) return [];

    return getFineTargetsByMatch({
      match: selectedMatch,
      players,
      attendance: attendance[selectedMatch.id] ?? [],
      votes: votes[selectedMatch.id] ?? [],
      fineRules,
      fineCharges,
    });
  }, [selectedMatch, players, attendance, votes, fineRules, fineCharges]);

  const handleAutoCharge = async () => {
    if (isSubmittingRef.current) return;

    if (!selectedMatch) {
      showToast("먼저 경기를 선택해 주세요.", "info");
      return;
    }

    if (fineTargets.length === 0) {
      showToast("자동 부과할 벌금 대상이 없어요.", "info");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const inputs = fineTargets.map((target) => ({
        matchId: selectedMatch.id,
        playerId: target.playerId,
        ruleId: target.ruleId,
        ruleName: target.ruleName,
        trigger: target.trigger,
        amount: target.amount,
        description: target.description,
      }));

      const success = await createFineCharges(inputs);

      if (!success) {
        showToast("벌금 자동 부과 중 저장에 실패했어요.", "error");
        return;
      }

      showToast("벌금이 미납 상태로 부과됐어요.", "success");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    selectedMatchId,
    onChangeSelectedMatchId: setSelectedMatchId,
    selectableMatches,
    fineTargets,
    isSubmitting,
    handleAutoCharge,
  };
}
