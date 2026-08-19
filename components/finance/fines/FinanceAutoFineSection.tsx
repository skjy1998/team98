import { formatFinanceEntryDescription } from "@/lib/finance/finance";
import { getFineTargetsByMatch } from "@/lib/finance/finance-fine";
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

interface FinanceAutoFineSectionProps {
  canManage: boolean;
  fineCharges: FineCharge[];
  matches: MatchItem[];
  players: PlayerType[];
  votes: MatchVotesByMatchId;
  attendance: MatchAttendanceByMatchId;
  fineRules: FineRule[];
  createFineCharges: (inputs: CreateFineChargeInput[]) => Promise<boolean>;
}

export default function FinanceAutoFineSection({
  canManage,
  fineCharges,
  matches,
  players,
  votes,
  attendance,
  fineRules,
  createFineCharges,
}: Readonly<FinanceAutoFineSectionProps>) {
  const showToast = useToastStore((state) => state.showToast);

  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const selectableMatches = useMemo(
    () =>
      matches
        .filter((match) => match.status !== "canceled" && !match.isUpcoming)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [matches],
  );

  const selectedMatch = useMemo(
    () => selectableMatches.find((match) => match.id === selectedMatchId),
    [selectableMatches, selectedMatchId],
  );

  const selectedVotes = useMemo(
    () => (selectedMatchId ? (votes[selectedMatchId] ?? []) : []),
    [votes, selectedMatchId],
  );

  const selectedAttendance = useMemo(
    () => (selectedMatchId ? (attendance[selectedMatchId] ?? []) : []),
    [attendance, selectedMatchId],
  );

  const fineTargets = useMemo(() => {
    if (!selectedMatch) return [];

    return getFineTargetsByMatch({
      match: selectedMatch,
      players,
      attendance: selectedAttendance,
      votes: selectedVotes,
      fineRules,
      fineCharges,
    });
  }, [
    selectedMatch,
    players,
    selectedAttendance,
    selectedVotes,
    fineRules,
    fineCharges,
  ]);

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
      const success = await createFineCharges(
        fineTargets.map((target) => ({
          matchId: selectedMatch.id,
          playerId: target.playerId,
          ruleId: target.ruleId,
          ruleName: target.ruleName,
          trigger: target.trigger,
          amount: target.amount,
          description: target.description,
        })),
      );

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

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">벌금 관리</h2>
          <p className="mt-2 text-sm text-stone-500">
            출석, 무단불참, 미투표 기준 벌금을 자동으로 부과할 수 있어요.
          </p>
        </div>

        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
          총 {fineCharges.length}건
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label
            htmlFor="fine-match"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            경기 선택
          </label>
          <select
            id="fine-match"
            value={selectedMatchId}
            onChange={(event) => setSelectedMatchId(event.target.value)}
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          >
            <option value="">경기를 선택하세요</option>
            {selectableMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.date} · {match.title}
              </option>
            ))}
          </select>
        </div>

        {canManage && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAutoCharge}
              disabled={
                !selectedMatchId || fineTargets.length === 0 || isSubmitting
              }
              className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "부과 중..." : "자동 부과하기"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-semibold text-stone-900">자동 부과 대상</p>

        {!selectedMatchId ? (
          <p className="mt-2 text-sm text-stone-500">
            경기를 선택하면 벌금 대상이 표시돼요.
          </p>
        ) : fineTargets.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            현재 경기에는 자동 부과할 대상이 없어요.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {fineTargets.map((target, index) => (
              <div
                key={`${target.playerId}-${target.trigger}-${index}`}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {target.playerName}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatFinanceEntryDescription(target.description)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-rose-600">
                  +{target.amount.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
