import FinancePaymentSummaryCard from "./FinancePaymentSummaryCard";
import FinancePaymentHeader from "./FinancePaymentHeader";
import FinancePaymentStatusGroup from "./FinancePaymentStatusGroup";
import FinanceReadonlyNotice from "./FinanceReadonlyNotice";
import type { FinancePaymentsSectionProps } from "@/types/finance-ui";
import { useMemo, useState } from "react";

export default function FinancePaymentsSection({
  canManage,
  headerState,
  paymentSummary,
  unpaidGroupState,
  paidGroupState,
  onChangePaymentStatus,
  onBulkMarkPaid,
}: Readonly<FinancePaymentsSectionProps>) {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const selectablePlayerIds = useMemo(
    () => unpaidGroupState.rows.map((row) => row.playerId),
    [unpaidGroupState.rows],
  );

  const handleToggleSelectAll = () => {
    setSelectedPlayerIds((prev) =>
      prev.length === selectablePlayerIds.length ? [] : selectablePlayerIds,
    );
  };

  const handleBulkSubmit = async () => {
    if (selectablePlayerIds.length === 0) {
      globalThis.alert("납부 처리할 인원을 먼저 선택해주세요.");
      return;
    }

    const selectedPlayers = unpaidGroupState.rows
      .filter((row) => selectedPlayerIds.includes(row.playerId))
      .map((row) => ({
        playerId: row.playerId,
        playerName: row.playerName,
      }));

    const success = await onBulkMarkPaid(selectedPlayers);

    if (!success) {
      globalThis.alert("일괄 납부 처리 중 실패했어요.");
      return;
    }

    setSelectedPlayerIds([]);
    globalThis.alert("선택 인원을 납부 처리했어요.");
  };

  return (
    <div className="space-y-6">
      <FinancePaymentHeader {...headerState} />
      <FinancePaymentSummaryCard paymentSummary={paymentSummary} />
      {!canManage && (
        <FinanceReadonlyNotice message="납부 현황은 조회할 수 있고, 납부 상태 변경은 운영진만 할 수 있어요." />
      )}
      {canManage && unpaidGroupState.rows.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                {selectedPlayerIds.length === selectablePlayerIds.length
                  ? "전체 해제"
                  : "전체 선택"}
              </button>

              <span className="text-sm text-stone-500">
                선택 {selectedPlayerIds.length}명
              </span>
            </div>

            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={selectedPlayerIds.length === 0}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              선택 인원 납부 처리
            </button>
          </div>
        </section>
      )}
      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={unpaidGroupState}
        onChangePaymentStatus={onChangePaymentStatus}
        selectable={canManage}
        selectedPlayerIds={selectedPlayerIds}
        onTogglePlayer={handleTogglePlayer}
      />

      <FinancePaymentStatusGroup
        canManage={canManage}
        groupState={paidGroupState}
        onChangePaymentStatus={onChangePaymentStatus}
      />
    </div>
  );
}
