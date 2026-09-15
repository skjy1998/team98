import type { PlayerType } from "@/types/player";
import type { FormationSlot } from "@/types/tactics";

interface TacticsSelectedSlotCardProps {
  selectedSlot?: FormationSlot;
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  onClearSlot: () => void;
  canManage: boolean;
}

function getSlotDescription(
  selectedSlot: FormationSlot | undefined,
  assignedPlayer: PlayerType | undefined,
  canManage: boolean,
) {
  if (!selectedSlot) {
    return canManage
      ? "포지션을 선택하세요."
      : "포메이션 배치를 확인할 수 있어요.";
  }

  if (assignedPlayer) {
    return `${assignedPlayer.name} 배치됨`;
  }

  if (selectedSlot.playerId) {
    return "배치된 선수 정보를 찾을 수 없습니다.";
  }

  return canManage
    ? "오른쪽에서 선수를 눌러 배치하세요."
    : "현재 포지션에 배치된 선수가 없습니다.";
}

export default function TacticsSelectedSlotCard({
  selectedSlot,
  getPlayerById,
  onClearSlot,
  canManage,
}: Readonly<TacticsSelectedSlotCardProps>) {
  const assignedPlayer = selectedSlot?.playerId
    ? getPlayerById(selectedSlot.playerId)
    : undefined;

  const description = getSlotDescription(
    selectedSlot,
    assignedPlayer,
    canManage,
  );

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-stone-900">선택한 포지션</h3>

      <div className="mt-3 rounded-xl bg-stone-50 px-4 py-3">
        {selectedSlot && (
          <p className="text-base font-semibold text-stone-900">
            {selectedSlot.label}
          </p>
        )}

        <p
          className={
            selectedSlot
              ? "mt-1 text-sm text-stone-500"
              : "text-sm text-stone-500"
          }
        >
          {description}
        </p>
      </div>

      {canManage && selectedSlot?.playerId && (
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
