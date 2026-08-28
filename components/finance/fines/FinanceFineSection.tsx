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
import { useMemo } from "react";
import FinanceManualFineForm from "./FinanceManualFineForm";
import FinanceAutoFineSection from "./FinanceAutoFineSection";
import FinanceFineChargeList from "./FinanceFineChargeList";
import { getSelectableFineMatches } from "@/lib/finance/finance-fine";
import { useFinanceManualFine } from "@/hooks/finance/useFinanceManualFine";

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
  const {
    rules: manualFineRules,
    isSubmitting: isManualSubmitting,
    formState: manualFineFormState,
    handleSubmit: handleManualCharge,
  } = useFinanceManualFine({
    fineRules,
    players,
    createFineCharges,
  });

  const selectableMatches = useMemo(
    () => getSelectableFineMatches(matches),
    [matches],
  );

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
