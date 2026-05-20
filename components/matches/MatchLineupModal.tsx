import FormationBoard from "@/components/tactics/FormationBoard";
import PlayerBench from "@/components/tactics/PlayerBench";
import { formationTemplate } from "@/data/formationTemplates";
import type { MatchLineup } from "@/types/match";
import type { Playertype } from "@/types/player";
import type { FormationName, FormationSlot } from "@/types/tactics";
import { useState } from "react";

interface MatchLineupModalProps {
  initialLineup?: MatchLineup;
  players: Playertype[];
  onClose: () => void;
  onSave: (lineup: MatchLineup) => void;
}

export default function MatchLineupModal({
  initialLineup,
  players,
  onClose,
  onSave,
}: Readonly<MatchLineupModalProps>) {
  const [formation, setFormation] = useState<FormationName>(
    initialLineup?.formation ?? "4-4-2",
  );
  const [slots, setSlots] = useState<FormationSlot[]>(
    initialLineup?.slots ?? formationTemplate["4-4-2"],
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const assignedPlayerIds = new Set(
    slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : [])),
  );

  const availablePlayers = players.filter(
    (player) => !assignedPlayerIds.has(player.id),
  );

  const handleFormationChange = (value: FormationName) => {
    setFormation(value);
    setSlots(formationTemplate[value]);
    setSelectedSlotId(null);
  };

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex h-[660px] w-[1020px] max-w-[calc(100vw-40px)] flex-col rounded-xl bg-white p-5">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">라인업 등록</h2>
            <p className="text-sm text-gray-500">
              슬롯을 선택한 뒤 선수를 배치하세요.
            </p>
          </div>

          <select
            value={formation}
            onChange={(e) =>
              handleFormationChange(e.target.value as FormationName)
            }
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="4-4-2">4-4-2</option>
            <option value="4-3-3">4-3-3</option>
          </select>
        </div>
        {/* 본문 */}
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_220px] gap-3">
          <FormationBoard
            slots={slots}
            players={players}
            selectedSlotId={selectedSlotId}
            onSelectSlot={(slotId) =>
              setSelectedSlotId((prev) => (prev === slotId ? null : slotId))
            }
            heightClassName="h-full"
          />

          <PlayerBench
            loaded={true}
            players={availablePlayers}
            selectedSlot={selectedSlot}
            selectedSlotId={selectedSlotId}
            onAssignPlayer={handleAssignPlayer}
            onClearSlot={handleClearSlot}
            listMaxHeightClassName="max-h-[330px]"
          />
        </div>

        <div className="mt-4 shrink-0 border-t pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-500"
          >
            취소
          </button>

          <button
            type="button"
            onClick={() => onSave({ formation, slots })}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
