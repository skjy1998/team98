import type {
  CreateFineChargeInput,
  FineCharge,
  FineRule,
} from "@/types/finance";
import FinanceReadonlyNotice from "./FinanceReadonlyNotice";
import { MatchItem } from "@/types/match";
import { PlayerType } from "@/types/player";
import { MatchVotesByMatchId } from "@/types/match-vote";
import { MatchAttendanceByMatchId } from "@/types/match-attendance";
import { useMemo, useState } from "react";
import { getFineTargetsByMatch } from "@/lib/finance/finance-fine";
import { formatFinanceEntryDescription } from "@/lib/finance/finance";
import FinanceManualFineForm from "./FinanceManualFineForm";

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
  const [selectedMatchId, setSelectedMatchId] = useState("");

  const [manualRuleId, setManualRuleId] = useState("");
  const [manualPlayerId, setManualPlayerId] = useState("");
  const [manualMatchId, setManualMatchId] = useState("");
  const [manualReason, setManualReason] = useState("");

  const [processingChargeIds, setProcessingChargeIds] = useState<string[]>([]);

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

  const manualFineRules = useMemo(
    () => fineRules.filter((rule) => rule.trigger === "etc"),
    [fineRules],
  );

  const handleAutoCharge = async () => {
    if (!selectedMatch) {
      globalThis.alert("먼저 경기를 선택해주세요.");
      return;
    }

    if (fineTargets.length === 0) {
      globalThis.alert("자동 부과할 벌금 대상이 없어요.");
      return;
    }

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
      globalThis.alert("벌금 자동 부과 중 저장에 실패했어요.");
      return;
    }

    globalThis.alert("벌금이 미납 상태로 부과되었어요.");
  };

  const handleManualCharge = async () => {
    const selectedRule = manualFineRules.find(
      (rule) => rule.id === manualRuleId,
    );

    const selectedPlayer = players.find(
      (player) => player.id === manualPlayerId,
    );

    if (!selectedRule || !selectedPlayer) {
      globalThis.alert("기타 벌금 규칙과 선수를 선택해주세요.");
      return;
    }

    const reason = manualReason.trim();

    if (!reason) {
      globalThis.alert("벌금 부과 사유를 입력해주세요.");
      return;
    }

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
      globalThis.alert("기타 벌금 부과에 실패했어요.");
      return;
    }

    setManualRuleId("");
    setManualPlayerId("");
    setManualMatchId("");
    setManualReason("");

    globalThis.alert("기타 벌금이 미납 상태로 부과되었어요.");
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
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
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
                disabled={!selectedMatchId || fineTargets.length === 0}
                className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                자동 부과하기
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
      {canManage && (
        <FinanceManualFineForm
          rules={manualFineRules}
          players={players}
          matches={selectableMatches}
          formState={manualFineFormState}
          onSubmit={handleManualCharge}
        />
      )}

      <section className="rounded-xl border border-stone-200 bg-white">
        {fineCharges.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            아직 생성된 벌금 내역이 없어요.
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {fineCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-stone-900">
                    {formatFinanceEntryDescription(charge.description)}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {new Date(charge.chargedAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`text-base font-semibold ${
                        charge.status === "paid"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {charge.amount.toLocaleString()}원
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      {charge.status === "paid" ? "납부 완료" : "미납 벌금"}
                    </p>
                  </div>

                  {canManage && (
                    <button
                      disabled={processingChargeIds.includes(charge.id)}
                      type="button"
                      onClick={async () => {
                        if (processingChargeIds.includes(charge.id)) return;

                        setProcessingChargeIds((prev) => [...prev, charge.id]);

                        try {
                          const nextStatus =
                            charge.status === "paid" ? "unpaid" : "paid";

                          const success = await onChangeFineChargeStatus(
                            charge,
                            nextStatus,
                          );
                          if (!success) {
                            globalThis.alert(
                              "벌금 납부 상태 변경에 실패했어요.",
                            );
                          }
                        } finally {
                          setProcessingChargeIds((prev) =>
                            prev.filter((id) => id !== charge.id),
                          );
                        }
                      }}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        charge.status === "paid"
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {processingChargeIds.includes(charge.id)
                        ? "처리 중..."
                        : charge.status === "paid"
                          ? "미납으로 변경"
                          : "납부 완료"}
                    </button>
                  )}
                  {canManage && charge.status === "unpaid" && (
                    <button
                      disabled={processingChargeIds.includes(charge.id)}
                      type="button"
                      onClick={async () => {
                        const confirmed =
                          globalThis.confirm("이 벌금 부과 내역을 삭제할까요?");

                        if (!confirmed) return;

                        const success = await deleteFineCharge(charge.id);

                        if (!success) {
                          globalThis.alert("벌금 삭제에 실패했어요.");
                        }
                      }}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
