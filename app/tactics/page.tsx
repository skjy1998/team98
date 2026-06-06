"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { usePlayers } from "@/hooks/usePlayers";
import type {
  FormationName,
  FormationSlot,
  SavedFormation,
} from "@/types/tactics";

import { useEffect, useMemo, useState } from "react";

export default function TacticsPage() {
  // 선수 목록 가져오는 훅
  const { players, loaded } = usePlayers();
  // 포메이션 상태
  const [formation, setFormation] = useState<FormationName>("4-4-2");
  // 클릭해서 선택한 포지션 슬롯 id
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  // 운동장 슬롯 배열
  const [slots, setSlots] = useState<FormationSlot[]>(
    formationTemplate["4-4-2"],
  );
  // localStorage 에서 저장된 전술을 다 읽었는지 체크하는 플래그
  const [formationLoaded, setFormationLoaded] = useState(false);

  const [cornerKickPlayerId, setCornerKickPlayerId] = useState("");
  const [freeKickPlayerId, setFreeKickPlayerId] = useState("");
  const [penaltyKickPlayerId, setPenaltyKickPlayerId] = useState("");

  // localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("tacticsFormation");

    if (saved) {
      const parsed = JSON.parse(saved) as SavedFormation;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormation(parsed.formation);
      setSlots(parsed.slots);
      setCornerKickPlayerId(parsed.cornerKickPlayerId ?? "");
      setFreeKickPlayerId(parsed.freeKickPlayerId ?? "");
      setPenaltyKickPlayerId(parsed.penaltyKickPlayerId ?? "");
    }

    setFormationLoaded(true);
  }, []);

  // localStorage에 저장
  useEffect(() => {
    if (!formationLoaded) return;

    localStorage.setItem(
      "tacticsFormation",
      JSON.stringify({
        formation,
        slots,
        cornerKickPlayerId,
        freeKickPlayerId,
        penaltyKickPlayerId,
      }),
    );
  }, [
    formation,
    slots,
    formationLoaded,
    cornerKickPlayerId,
    freeKickPlayerId,
    penaltyKickPlayerId,
  ]);

  // 현재 선택된 슬롯 계산
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );

  // 슬롯에 배치된 선수 찾기
  const getPlayerById = (playerId?: string) =>
    players.find((player) => player.id === playerId);

  // 이미 배치된 선수 id들 모으기
  const assignedPlayerIds = useMemo(
    () =>
      new Set(slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : []))),
    [slots],
  );
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
  const handleResetFormation = () => {
    setSlots(formationTemplate[formation]);
    setSelectedSlotId(null);
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

  const cornerKickPlayer = getPlayerById(cornerKickPlayerId);
  const freeKickPlayer = getPlayerById(freeKickPlayerId);
  const penaltyKickPlayer = getPlayerById(penaltyKickPlayerId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술 보드"
        description="포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
      />
      <TacticsToolbar
        formation={formation}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          getPlayerById={getPlayerById}
        />
        <TacticsSidebar
          loaded={loaded}
          players={players}
          availablePlayers={availablePlayers}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
          getPlayerById={getPlayerById}
          cornerKickPlayerId={cornerKickPlayerId}
          freeKickPlayerId={freeKickPlayerId}
          penaltyKickPlayerId={penaltyKickPlayerId}
          onChangeCornerKickPlayerId={setCornerKickPlayerId}
          onChangeFreeKickPlayerId={setFreeKickPlayerId}
          onChangePenaltyKickPlayerId={setPenaltyKickPlayerId}
          cornerKickPlayer={cornerKickPlayer}
          freeKickPlayer={freeKickPlayer}
          penaltyKickPlayer={penaltyKickPlayer}
        />
      </div>
    </div>
  );
}
