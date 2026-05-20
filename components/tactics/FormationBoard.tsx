import { Playertype } from "@/types/player";
import { FormationSlot } from "@/types/tactics";

interface FormationBoardProps {
  slots: FormationSlot[];
  players: Playertype[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  heightClassName?: string;
}

export default function FormationBoard({
  slots,
  players,
  selectedSlotId,
  onSelectSlot,
  heightClassName,
}: Readonly<FormationBoardProps>) {
  return (
    // 초록색 운동장
    <div
      className={`relative ${heightClassName ?? "h-[620px]"} overflow-hidden rounded-xl bg-green-600`}
    >
      {/* 아웃 라인 */}
      <div className="absolute inset-4 rounded-lg border border-white/30" />
      {/* 가운데 원 */}
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      {/* 가운데 선 */}
      <div className="absolute left-0 top-1/2 h-px w-full bg-white/25" />
      {/* 위 골대 */}
      <div className="absolute left-1/2 top-4 h-20 w-40 -translate-x-1/2 border border-white/25" />
      {/* 아래골대 */}
      <div className="absolute bottom-4 left-1/2 h-20 w-40 -translate-x-1/2 border border-white/25"></div>
      {slots.map((slot) => {
        const player = players.find((p) => p.id === slot.playerId);
        const isActive = selectedSlotId === slot.id;
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelectSlot(slot.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-sm font-bold shadow transition ${
              isActive
                ? "bg-yellow-300 text-black ring-4 ring-yellow-100"
                : "bg-white text-gray-700"
            }`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            {player ? `${player.number} ${player.name}` : slot.label}
          </button>
        );
      })}
    </div>
  );
}
