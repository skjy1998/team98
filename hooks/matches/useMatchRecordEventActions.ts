import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordQuarter,
} from "@/types/match";
import type { PlayerType } from "@/types/player";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

interface UseMatchRecordEventActionsParams {
  canEdit: boolean;
  attendPlayers: PlayerType[];
  addEvent: (type: MatchRecordEventType) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  updateEvent: (
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => Promise<boolean>;
  reorderEvents: (activeId: string, overId: string) => Promise<boolean>;
}

export function useMatchRecordEventActions({
  canEdit,
  attendPlayers,
  addEvent,
  deleteEvent,
  updateEvent,
  reorderEvents,
}: UseMatchRecordEventActionsParams) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleStartEdit = (event: MatchRecordEvent) => {
    if (!canEdit) return;
    setEditingEventId(event.id);
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const handleAddEvent = async (type: MatchRecordEventType) => {
    if (!canEdit) return;

    const success = await addEvent(type);

    if (!success) {
      showToast("기록 추가에 실패했어요.", "error");
    }
  };

  const handleDeleteRecord = async (event: MatchRecordEvent) => {
    if (!canEdit) return;

    const confirmed = await confirm({
      title: "경기 기록 삭제",
      description: "이 경기 기록을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    if (editingEventId === event.id) {
      handleCancelEdit();
    }

    const success = await deleteEvent(event.id);

    if (!success) {
      showToast("기록 삭제에 실패했어요.", "error");
      return;
    }

    showToast("경기 기록을 삭제했어요.", "success");
  };

  const handleSubmitEdit = async (
    eventId: string,
    updates: {
      playerId: string;
      assistPlayerId: string;
      quarter: MatchRecordQuarter;
      minute: string;
    },
  ) => {
    if (!canEdit) return;

    const selectedPlayer = attendPlayers.find(
      (player) => player.id === updates.playerId,
    );

    const selectedAssistPlayer = attendPlayers.find(
      (player) => player.id === updates.assistPlayerId,
    );

    const success = await updateEvent(eventId, {
      playerId: updates.playerId,
      playerName: selectedPlayer?.name ?? "",
      assistPlayerId: updates.assistPlayerId,
      assistPlayerName: selectedAssistPlayer?.name ?? "",
      quarter: updates.quarter,
      minute: updates.minute,
    });

    if (!success) {
      showToast("기록 수정에 실패했어요.", "error");
      return;
    }

    handleCancelEdit();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!canEdit) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const success = await reorderEvents(String(active.id), String(over.id));

    if (!success) {
      showToast("기록 순서 변경에 실패했어요.", "error");
    }
  };

  return {
    editingEventId,
    handleStartEdit,
    handleCancelEdit,
    handleAddEvent,
    handleDeleteRecord,
    handleSubmitEdit,
    handleDragEnd,
  };
}
