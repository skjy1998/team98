import type {
  CreateFineChargeInput,
  FineCharge,
  FineRule,
} from "@/types/finance";
import FinanceReadonlyNotice from "../FinanceReadonlyNotice";
import type { MatchItem } from "@/types/match";
import type { PlayerType } from "@/types/player";
import type { MatchVotesByMatchId } from "@/types/match-vote";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import { useMemo, useRef, useState } from "react";
import FinanceManualFineForm from "./FinanceManualFineForm";
import FinanceAutoFineSection from "./FinanceAutoFineSection";
import FinanceFineChargeList from "./FinanceFineChargeList";
import { useToastStore } from "@/stores/toast-store";

interface FinanceFineSectionProps {
  fineCharges: FineCharge[];
  canManage: boolean;
  matches: MatchItem[];
  players: PlayerType[];
  votes: MatchVotesByMatchId;
  attendance: MatchAttendanceByMatchId;
  fineRules: FineRule[];
  createFineCharges: (inputs: CreateFineChargeInput[]) => Promise<boolean>;
  deleteFineCharge: (fineChargeId: string) => Promise<boolean>;
  onChangeFineChargeStatus: (
    charge: FineCharge,
    nextStatus: FineCharge["status"],
  ) => Promise<boolean>;
}

export default function FinanceFineSection({
  fineCharges,
  canManage,
  matches,
  players,
  votes,
  attendance,
  fineRules,
  createFineCharges,
  deleteFineCharge,
  onChangeFineChargeStatus,
}: Readonly<FinanceFineSectionProps>) {
  const showToast = useToastStore((state) => state.showToast);

  const [manualRuleId, setManualRuleId] = useState("");
  const [manualPlayerId, setManualPlayerId] = useState("");
  const [manualMatchId, setManualMatchId] = useState("");
  const [manualReason, setManualReason] = useState("");

  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const isManualSubmittingRef = useRef(false);

  const selectableMatches = useMemo(
    () =>
      matches
        .filter((match) => match.status !== "canceled" && !match.isUpcoming)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [matches],
  );

  const manualFineRules = useMemo(
    () => fineRules.filter((rule) => rule.trigger === "etc"),
    [fineRules],
  );

  const handleManualCharge = async () => {
    if (isManualSubmittingRef.current) return;

    const selectedRule = manualFineRules.find(
      (rule) => rule.id === manualRuleId,
    );

    const selectedPlayer = players.find(
      (player) => player.id === manualPlayerId,
    );

    if (!selectedRule || !selectedPlayer) {
      showToast("기타 벌금 규칙과 선수를 선택해 주세요.", "info");
      return;
    }

    const reason = manualReason.trim();

    if (!reason) {
      showToast("벌금 부과 사유를 입력해 주세요.", "info");
      return;
    }

    isManualSubmittingRef.current = true;
    setIsManualSubmitting(true);

    try {
      const success = await createFineCharges([
        {
          matchId: manualMatchId || undefined,
          playerId: selectedPlayer.id,
          ruleId: selectedRule.id,
          ruleName: selectedRule.name,
          trigger: selectedRule.trigger,
          amount: selectedRule.amount,
          description: `[etc] ${reason} (${selectedPlayer.name})`,
        },
      ]);

      if (!success) {
        showToast("기타 벌금 부과에 실패했어요.", "error");
        return;
      }

      setManualRuleId("");
      setManualPlayerId("");
      setManualMatchId("");
      setManualReason("");

      showToast("기타 벌금이 미납 상태로 부과됐어요.", "success");
    } finally {
      isManualSubmittingRef.current = false;
      setIsManualSubmitting(false);
    }
  };

  const manualFineFormState = {
    ruleId: manualRuleId,
    onChangeRuleId: setManualRuleId,
    playerId: manualPlayerId,
    onChangePlayerId: setManualPlayerId,
    matchId: manualMatchId,
    onChangeMatchId: setManualMatchId,
    reason: manualReason,
    onChangeReason: setManualReason,
  };

  return (
    <div className="space-y-6">
      {!canManage && (
        <FinanceReadonlyNotice message="벌금 내역은 조회할 수 있고, 자동 부과와 수정은 운영진만 할 수 있어요." />
      )}

      <FinanceAutoFineSection
        canManage={canManage}
        fineCharges={fineCharges}
        matches={matches}
        players={players}
        votes={votes}
        attendance={attendance}
        fineRules={fineRules}
        createFineCharges={createFineCharges}
      />
      {canManage && (
        <FinanceManualFineForm
          rules={manualFineRules}
          players={players}
          matches={selectableMatches}
          formState={manualFineFormState}
          isSubmitting={isManualSubmitting}
          onSubmit={handleManualCharge}
        />
      )}
      <FinanceFineChargeList
        fineCharges={fineCharges}
        canManage={canManage}
        deleteFineCharge={deleteFineCharge}
        onChangeFineChargeStatus={onChangeFineChargeStatus}
      />
    </div>
  );
}
