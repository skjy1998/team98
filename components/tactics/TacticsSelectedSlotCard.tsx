import type { PlayerType } from "@/types/player";
import type { FormationSlot } from "@/types/tactics";

interface TacticsSelectedSlotCardProps {
  selectedSlot?: FormationSlot;
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  onClearSlot: () => void;
}

export default function TacticsSelectedSlotCard({
  selectedSlot,
  getPlayerById,
  onClearSlot,
}: Readonly<TacticsSelectedSlotCardProps>) {
  const assignedPlayerName = selectedSlot?.playerId
    ? (getPlayerById(selectedSlot.playerId)?.name ?? "")
    : "";
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-stone-900">선택한 포지션</h3>

      <div className="mt-3 rounded-xl bg-stone-50 px-4 py-3">
        {selectedSlot ? (
          <>
            <p className="text-base font-semibold text-stone-900">
              {selectedSlot.label}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {selectedSlot.playerId
                ? `${assignedPlayerName} 배치됨`
                : "오른쪽에서 선수를 눌러 배치하세요."}
            </p>
          </>
        ) : (
          <p className="text-sm text-stone-500">포지션을 선택하세요.</p>
        )}
      </div>

      {selectedSlot?.playerId && (
        <button
          type="button"
          onClick={onClearSlot}
          className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          선택 포지션 비우기
        </button>
      )}
    </section>
  );
}
