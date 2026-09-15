import { useState } from "react";
import type {
  FormationName,
  QuarterTacticsState,
  SavedFormation,
  SetPieceKey,
} from "@/types/tactics";

import { usePlayers } from "../players/usePlayers";
import {
  assignPlayerToTacticsSlot,
  changeTacticsFormation,
  clearTacticsSlot,
  getAssignedPlayerIds,
  getPlayerById as findPlayerById,
  resetTacticsFormation,
  createDefaultQuarterTactics,
} from "@/lib/tactics/tactics-ui";

export function useTacticsBoard() {
  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();

  // 클릭해서 선택한 포지션 슬롯 id
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [tacticsState, setTacticsState] = useState<QuarterTacticsState>(
    createDefaultQuarterTactics,
  );

  const { formation, slots } = tacticsState;

  const cornerKickPlayerId = tacticsState.cornerKickPlayerId ?? "";
  const freeKickPlayerId = tacticsState.freeKickPlayerId ?? "";
  const penaltyKickPlayerId = tacticsState.penaltyKickPlayerId ?? "";

  // 현재 선택된 슬롯 계산
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  // 슬롯에 배치된 선수 찾기
  const getPlayerById = (playerId?: string) =>
    findPlayerById(players, playerId);

  // 이미 배치된 선수 id들 모으기
  const assignedPlayerIds = getAssignedPlayerIds(slots);
  // 아직 배치 안 된 선수들만 골라내기
  const availablePlayers = players.filter(
    (player) => !assignedPlayerIds.has(player.id),
  );

  // 포메이션 바꾸기
  const handleFormationChange = (value: FormationName) => {
    setTacticsState((current) => changeTacticsFormation(current, value));
    setSelectedSlotId(null);
  };

  // 포메이션 초기화
  const handleResetTactics = () => {
    setTacticsState(resetTacticsFormation);
    setSelectedSlotId(null);
  };

  // 선수 배치하기
  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    setTacticsState((current) =>
      assignPlayerToTacticsSlot(current, selectedSlotId, playerId),
    );

    setSelectedSlotId(null);
  };

  // 포지션 비우기
  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    setTacticsState((current) => clearTacticsSlot(current, selectedSlotId));
    setSelectedSlotId(null);
  };

  const handleChangeSetPiecePlayer = (key: SetPieceKey, value: string) => {
    setTacticsState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // 내보내기 함수
  const exportTactics = () => tacticsState;

  const importTactics = (data: SavedFormation) => {
    setTacticsState({
      formation: data.formation,
      slots: data.slots,
      cornerKickPlayerId: data.cornerKickPlayerId ?? "",
      freeKickPlayerId: data.freeKickPlayerId ?? "",
      penaltyKickPlayerId: data.penaltyKickPlayerId ?? "",
    });

    setSelectedSlotId(null);
  };

  return {
    players,
    playersLoaded,
    playersError,
    reloadPlayers,

    formation,
    slots,
    selectedSlotId,
    selectedSlot,

    availablePlayers,

    cornerKickPlayerId,
    freeKickPlayerId,
    penaltyKickPlayerId,

    getPlayerById,
    setSelectedSlotId,
    handleChangeSetPiecePlayer,

    handleFormationChange,
    handleResetTactics,
    handleAssignPlayer,
    handleClearSlot,

    exportTactics,
    importTactics,
  };
}
