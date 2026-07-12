import type { PlayerType } from "@/types/player";
import type { FormationName, FormationSlot } from "@/types/tactics";

interface TacticsFieldProps {
  formation: FormationName;
  slots: FormationSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (value: string | null) => void;
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  canManage: boolean;
}

export default function TacticsField({
  formation,
  slots,
  selectedSlotId,
  onSelectSlot,
  getPlayerById,
  canManage,
}: Readonly<TacticsFieldProps>) {
  const handleSelectSlot = (slotId: string) => {
    if (!canManage) return;
    onSelectSlot(selectedSlotId === slotId ? null : slotId);
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            포메이션 보드
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {canManage
              ? "포지션을 선택한 뒤 오른쪽 선수 목록에서 배치할 수 있어요."
              : "전술 배치를 확인할 수 있어요."}
          </p>
        </div>

        <div className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
          {formation}
        </div>
      </div>

      <div className="relative h-[880px] overflow-hidden rounded-xl border border-emerald-900/10 bg-[linear-gradient(180deg,#4d8f64_0%,#4d8f64_12.5%,#438259_12.5%,#438259_25%,#4d8f64_25%,#4d8f64_37.5%,#438259_37.5%,#438259_50%,#4d8f64_50%,#4d8f64_62.5%,#438259_62.5%,#438259_75%,#4d8f64_75%,#4d8f64_87.5%,#438259_87.5%,#438259_100%)] shadow-inner">
        <div className="absolute inset-3 rounded-xl border-2 border-white/35" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/30" />
        <div className="absolute left-1/2 top-3 h-28 w-96 -translate-x-1/2 border-2 border-white/30" />
        <div className="absolute left-1/2 top-3 h-14 w-32 -translate-x-1/2 border-2 border-white/30" />
        <div className="absolute bottom-3 left-1/2 h-28 w-96 -translate-x-1/2 border-2  border-white/30" />
        <div className="absolute bottom-3 left-1/2 h-14 w-32 -translate-x-1/2 border-2  border-white/30" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />

        {slots.map((slot) => {
          const isActive = selectedSlotId === slot.id;
          const player = getPlayerById(slot.playerId);

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleSelectSlot(slot.id)}
              aria-disabled={!canManage}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-center transition ${
                isActive
                  ? "border-white bg-white/20 text-white ring-4 ring-white/15"
                  : canManage
                    ? "border-white/35 bg-black/10 text-white/90 hover:bg-white/10"
                    : "border-white/35 bg-black/10 text-white/90"
              }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="flex h-15 w-15 flex-col items-center justify-center px-3 py-2">
                <span className="text-sm font-bold tracking-wide">
                  {slot.label}
                </span>
                {player && (
                  <span className="mt-1 max-w-[88px] truncate text-sm font-medium text-white/90">
                    {player.name}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
