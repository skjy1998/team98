import { useMemo, useState } from "react";
import type {
  FormationName,
  QuarterTacticsState,
  SavedFormation,
} from "@/types/tactics";
import { formationTemplate } from "@/data/formationTemplates";
import { usePlayers } from "../players/usePlayers";
import {
  assignPlayerToTacticsSlot,
  changeTacticsFormation,
  clearTacticsSlot,
  getAssignedPlayerIds,
  getPlayerById as findPlayerById,
  resetTacticsFormation,
} from "@/lib/tactics/tactics-ui";

export function useTacticsBoard() {
  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();

  // 클릭해서 선택한 포지션 슬롯 id
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [tacticsState, setTacticsState] = useState<QuarterTacticsState>({
    formation: "4-4-2",
    slots: formationTemplate["4-4-2"],
    cornerKickPlayerId: "",
    freeKickPlayerId: "",
    penaltyKickPlayerId: "",
  });

  const { formation, slots } = tacticsState;

  const cornerKickPlayerId = tacticsState.cornerKickPlayerId ?? "";
  const freeKickPlayerId = tacticsState.freeKickPlayerId ?? "";
  const penaltyKickPlayerId = tacticsState.penaltyKickPlayerId ?? "";

  // 현재 선택된 슬롯 계산
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );
  // 슬롯에 배치된 선수 찾기
  const getPlayerById = (playerId?: string) =>
    findPlayerById(players, playerId);

  // 이미 배치된 선수 id들 모으기
  const assignedPlayerIds = useMemo(() => getAssignedPlayerIds(slots), [slots]);
  // 아직 배치 안 된 선수들만 골라내기
  const availablePlayers = useMemo(
    () => players.filter((player) => !assignedPlayerIds.has(player.id)),
    [players, assignedPlayerIds],
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

  const setCornerKickPlayerId = (value: string) => {
    setTacticsState((current) => ({
      ...current,
      cornerKickPlayerId: value,
    }));
  };

  const setFreeKickPlayerId = (value: string) => {
    setTacticsState((current) => ({
      ...current,
      freeKickPlayerId: value,
    }));
  };

  const setPenaltyKickPlayerId = (value: string) => {
    setTacticsState((current) => ({
      ...current,
      penaltyKickPlayerId: value,
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
    setCornerKickPlayerId,
    setFreeKickPlayerId,
    setPenaltyKickPlayerId,

    handleFormationChange,
    handleResetTactics,
    handleAssignPlayer,
    handleClearSlot,

    exportTactics,
    importTactics,
  };
}
