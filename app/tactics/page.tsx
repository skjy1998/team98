"use client";

import PageHeader from "@/components/PageHeader";
import FormationPanel from "@/components/tactics/FormationPanel";
import PlayerBench from "@/components/tactics/PlayerBench";
import { formationTemplate } from "@/data/formationTemplates";
import { usePlayers } from "@/hooks/usePlayers";
import { FormationName, FormationSlot, SavedFormation } from "@/types/tactics";
import { useEffect, useState } from "react";

export default function TacticsPage() {
  // 포메이션 관리
  const [formation, setFormation] = useState<FormationName>("4-4-2");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slots, setSlots] = useState<FormationSlot[]>(
    formationTemplate["4-4-2"],
  );
  // 포메이션 저장
  const [formationLoaded, setFormationLoaded] = useState(false);

  // 선수 목록
  const { players, loaded } = usePlayers();

  // 포메이션 선택
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  // 포메이션에 등록된 선수 리스트에서 빼기
  const assignedPlayerIds = new Set(
    slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : [])),
  );

  const availablePlayers = players.filter(
    (player) => !assignedPlayerIds.has(player.id),
  );

  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId } : slot,
      ),
    );
  };

  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
      ),
    );
    setSelectedSlotId(null);
  };

  // 포메이션 변경 함수
  const handleFormationChange = (value: FormationName) => {
    setFormation(value);
    setSlots(formationTemplate[value]);
    setSelectedSlotId(null);
  };

  // 포메이션 저장
  useEffect(() => {
    const saved = localStorage.getItem("tacticsFormation");
    if (saved) {
      const parsed = JSON.parse(saved) as SavedFormation;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormation(parsed.formation);
      setSlots(parsed.slots);
    }
    setFormationLoaded(true);
  }, []);

  useEffect(() => {
    if (!formationLoaded) return;
    localStorage.setItem(
      "tacticsFormation",
      JSON.stringify({
        formation,
        slots,
      }),
    );
  }, [formation, slots, formationLoaded]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술/포메이션"
        description="선수를 포메이션에 배치하고 전술 구성을 확인하세요."
      />
      <div className="grid grid-cols-[1fr_280px] gap-4 2xl:grid-cols-[1fr_320px]">
        <FormationPanel
          formation={formation}
          slots={slots}
          players={players}
          selectedSlotId={selectedSlotId}
          onFormationChange={handleFormationChange}
          onSelectSlot={(slotId) =>
            setSelectedSlotId((prev) => (prev === slotId ? null : slotId))
          }
        />
        <PlayerBench
          loaded={loaded}
          players={availablePlayers}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
        />
      </div>
    </div>
  );
}
