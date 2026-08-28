import { useToastStore } from "@/stores/toast-store";
import type { PaymentStatusRow } from "@/types/finance";
import { useMemo, useRef, useState } from "react";

interface UseFinancePaymentSelectionParams {
  unpaidRows: PaymentStatusRow[];
  onChangePaymentStatus: (
    playerId: string,
    playerName: string,
    nextStatus: PaymentStatusRow["status"],
  ) => Promise<boolean>;
  onBulkMarkPaid: (
    players: Array<{ playerId: string; playerName: string }>,
  ) => Promise<boolean>;
  onMoveMonth: (direction: "prev" | "next") => void;
}

export function useFinancePaymentSelection({
  unpaidRows,
  onChangePaymentStatus,
  onBulkMarkPaid,
  onMoveMonth,
}: UseFinancePaymentSelectionParams) {
  const showToast = useToastStore((state) => state.showToast);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const selectablePlayerIds = useMemo(
    () => unpaidRows.map((row) => row.playerId),
    [unpaidRows],
  );

  const validSelectedPlayerIds = useMemo(
    () =>
      selectedPlayerIds.filter((playerId) =>
        selectablePlayerIds.includes(playerId),
      ),
    [selectedPlayerIds, selectablePlayerIds],
  );

  const isAllSelected =
    selectablePlayerIds.length > 0 &&
    validSelectedPlayerIds.length === selectablePlayerIds.length;

  const handleTogglePlayer = (playerId: string) => {
    if (isSubmittingRef.current) return;

    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  };

  const handleToggleSelectAll = () => {
    if (isSubmittingRef.current) return;

    setSelectedPlayerIds(isAllSelected ? [] : selectablePlayerIds);
  };

  const handleBulkSubmit = async () => {
    if (isSubmittingRef.current) return;

    if (validSelectedPlayerIds.length === 0) {
      showToast("납부 처리할 인원을 먼저 선택해 주세요.", "info");
      return;
    }

    const selectedPlayers = unpaidRows
      .filter((row) => validSelectedPlayerIds.includes(row.playerId))
      .map(({ playerId, playerName }) => ({ playerId, playerName }));

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await onBulkMarkPaid(selectedPlayers);

      if (!success) {
        showToast("일괄 납부 처리 중 실패했어요.", "error");
        return;
      }

      setSelectedPlayerIds([]);
      showToast("선택 인원을 납부 처리했어요.", "success");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChangePaymentStatus = async (
    playerId: string,
    playerName: string,
    nextStatus: PaymentStatusRow["status"],
  ) => {
    if (isSubmittingRef.current) return false;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await onChangePaymentStatus(
        playerId,
        playerName,
        nextStatus,
      );

      if (!success) {
        showToast("납부 상태 변경에 실패했어요.", "error");
        return false;
      }

      const message =
        nextStatus === "paid"
          ? `${playerName}님을 납부 완료 처리했어요.`
          : `${playerName}님을 미납 처리했어요.`;

      showToast(message, "success");
      return true;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleMoveMonth = (direction: "prev" | "next") => {
    if (isSubmittingRef.current) return;

    setSelectedPlayerIds([]);
    onMoveMonth(direction);
  };

  return {
    selectedPlayerIds: validSelectedPlayerIds,
    selectedCount: validSelectedPlayerIds.length,
    isAllSelected,
    isSubmitting,
    handleTogglePlayer,
    handleToggleSelectAll,
    handleBulkSubmit,
    handleChangePaymentStatus,
    handleMoveMonth,
  };
}
