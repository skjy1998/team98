import { FormationName, FormationSlot } from "@/types/tactics";
import FormationBoard from "./FormationBoard";
import { PlayerType } from "@/types/player";

interface FormationPanelProps {
  formation: FormationName;
  slots: FormationSlot[];
  players: PlayerType[];
  selectedSlotId: string | null;
  onFormationChange: (formation: FormationName) => void;
  onSelectSlot: (slotId: string) => void;
}

export default function FormationPanel({
  formation,
  slots,
  players,
  selectedSlotId,
  onFormationChange,
  onSelectSlot,
}: Readonly<FormationPanelProps>) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold">포메이션 보드</h2>
          <p className="text-sm text-gray-500">
            슬롯을 선택한 뒤 오른쪽 선수 목록에서 배치하세요.
          </p>
        </div>
        <select
          value={formation}
          onChange={(e) => onFormationChange(e.target.value as FormationName)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="4-4-2">4-4-2</option>
          <option value="4-3-3">4-3-3</option>
        </select>
      </div>
      <FormationBoard
        slots={slots}
        players={players}
        selectedSlotId={selectedSlotId}
        onSelectSlot={onSelectSlot}
      />
    </section>
  );
}
