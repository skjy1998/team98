import { useMemo, useState } from "react";

import type {
  FormationName,
  FormationSlot,
  SavedFormation,
} from "@/types/tactics";
import { formationTemplate } from "@/data/formationTemplates";
import { usePlayers } from "../players/usePlayers";
import {
  getAssignedPlayerIds,
  getPlayerById as findPlayerById,
} from "@/lib/tactics/tactics-ui";

export function useTacticsBoard() {
  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();
  // 포메이션 상태
  const [formation, setFormation] = useState<FormationName>("4-4-2");
  // 클릭해서 선택한 포지션 슬롯 id
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  // 운동장 슬롯 배열
  const [slots, setSlots] = useState<FormationSlot[]>(
    formationTemplate["4-4-2"],
  );
  const [cornerKickPlayerId, setCornerKickPlayerId] = useState("");
  const [freeKickPlayerId, setFreeKickPlayerId] = useState("");
  const [penaltyKickPlayerId, setPenaltyKickPlayerId] = useState("");

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
    setFormation(value);
    setSlots(formationTemplate[value]);
    setSelectedSlotId(null);
  };

  // 포메이션 초기화
  const handleResetTactics = () => {
    setSlots(formationTemplate[formation]);
    setSelectedSlotId(null);
    setCornerKickPlayerId("");
    setFreeKickPlayerId("");
    setPenaltyKickPlayerId("");
  };

  // 선수 배치하기
  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId } : slot,
      ),
    );
    setSelectedSlotId(null);
  };

  // 포지션 비우기
  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
      ),
    );
    setSelectedSlotId(null);
  };

  // 내보내기 함수
  const exportTactics = () => ({
    formation,
    slots,
    cornerKickPlayerId,
    freeKickPlayerId,
    penaltyKickPlayerId,
  });

  const importTactics = (data: SavedFormation) => {
    setFormation(data.formation);
    setSlots(data.slots);
    setCornerKickPlayerId(data.cornerKickPlayerId ?? "");
    setFreeKickPlayerId(data.freeKickPlayerId ?? "");
    setPenaltyKickPlayerId(data.penaltyKickPlayerId ?? "");
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
