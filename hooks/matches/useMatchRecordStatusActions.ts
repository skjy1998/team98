import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import { useState } from "react";

interface UseMatchRecordStatusActionsParams {
  canManage: boolean;
  hasMatchStarted: boolean;
  recordCompletedAt?: string;
  countsTowardRecord: boolean;
  onChangeCompletion: (completed: boolean) => Promise<boolean>;
  onChangeRecordInclusion: (countsTowardRecord: boolean) => Promise<boolean>;
}

export function useMatchRecordStatusActions({
  canManage,
  hasMatchStarted,
  recordCompletedAt,
  countsTowardRecord,
  onChangeCompletion,
  onChangeRecordInclusion,
}: UseMatchRecordStatusActionsParams) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [isCompletionSaving, setIsCompletionSaving] = useState(false);
  const [isInclusionSaving, setIsInclusionSaving] = useState(false);

  const isCompleted = Boolean(recordCompletedAt);
  const canEdit = canManage && hasMatchStarted && !isCompleted;

  const handleChangeCompletion = async () => {
    if (!canManage || !hasMatchStarted || isCompletionSaving) return;

    const confirmed = await confirm({
      title: isCompleted ? "경기 기록 다시 열기" : "경기 기록 완료",
      description: isCompleted
        ? "완료된 경기 기록을 다시 수정할 수 있는 상태로 변경할까요?"
        : "경기 기록을 완료할까요? 0:0 경기라면 기록이 없어도 완료할 수 있어요.",
      confirmLabel: isCompleted ? "다시 열기" : "완료",
    });

    if (!confirmed) return;

    setIsCompletionSaving(true);

    try {
      const success = await onChangeCompletion(!isCompleted);

      if (!success) {
        showToast("경기 기록 상태 변경에 실패했어요.", "error");
        return;
      }

      showToast(
        isCompleted
          ? "경기 기록을 다시 수정할 수 있어요."
          : "경기 기록을 완료 처리했어요.",
        "success",
      );
    } finally {
      setIsCompletionSaving(false);
    }
  };

  const handleChangeRecordInclusion = async () => {
    if (!canManage || isInclusionSaving) return;

    setIsInclusionSaving(true);

    try {
      const success = await onChangeRecordInclusion(!countsTowardRecord);

      if (!success) {
        showToast("전적 반영 설정 변경에 실패했어요.", "error");
        return;
      }

      showToast(
        countsTowardRecord
          ? "이 경기를 팀 전적에서 제외했어요."
          : "이 경기를 팀 전적에 반영했어요.",
        "success",
      );
    } finally {
      setIsInclusionSaving(false);
    }
  };

  return {
    isCompleted,
    canEdit,
    isCompletionSaving,
    isInclusionSaving,
    handleChangeCompletion,
    handleChangeRecordInclusion,
  };
}
