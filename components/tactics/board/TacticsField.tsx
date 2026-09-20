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
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4 sm:items-center">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            포메이션 보드
          </h2>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            {canManage ? (
              <>
                <span className="sm:hidden">
                  포지션을 눌러 선수를 배치하세요.
                </span>
                <span className="hidden sm:inline">
                  포지션을 선택한 뒤 오른쪽 선수 목록에서 배치할 수 있어요.
                </span>
              </>
            ) : (
              <>
                <span className="sm:hidden">전술 배치를 확인하세요.</span>
                <span className="hidden sm:inline">
                  전술 배치를 확인할 수 있어요.
                </span>
              </>
            )}
          </p>
        </div>

        <div className="shrink-0 whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 sm:px-3 sm:text-sm">
          {formation}
        </div>
      </div>

      <div className="relative h-[560px] overflow-hidden rounded-xl border border-emerald-900/10 bg-[linear-gradient(180deg,#4d8f64_0%,#4d8f64_12.5%,#438259_12.5%,#438259_25%,#4d8f64_25%,#4d8f64_37.5%,#438259_37.5%,#438259_50%,#4d8f64_50%,#4d8f64_62.5%,#438259_62.5%,#438259_75%,#4d8f64_75%,#4d8f64_87.5%,#438259_87.5%,#438259_100%)] shadow-inner sm:h-[720px] lg:h-[880px]">
        <div className="absolute inset-2 rounded-xl border-2 border-white/35 sm:inset-3" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 sm:h-44 sm:w-44" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/30" />
        <div className="absolute left-1/2 top-2 h-20 w-[88%] -translate-x-1/2 border-2 border-white/30 sm:top-3 sm:h-28 sm:w-96" />
        <div className="absolute left-1/2 top-2 h-10 w-24 -translate-x-1/2 border-2 border-white/30 sm:top-3 sm:h-14 sm:w-32" />
        <div className="absolute bottom-2 left-1/2 h-20 w-[88%] -translate-x-1/2 border-2 border-white/30 sm:bottom-3 sm:h-28 sm:w-96" />
        <div className="absolute bottom-2 left-1/2 h-10 w-24 -translate-x-1/2 border-2 border-white/30 sm:bottom-3 sm:h-14 sm:w-32" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />

        {slots.map((slot) => {
          const isActive = selectedSlotId === slot.id;
          const player = getPlayerById(slot.playerId);

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleSelectSlot(slot.id)}
              aria-pressed={isActive}
              disabled={!canManage}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-center transition ${
                isActive
                  ? "border-white bg-white/20 text-white ring-4 ring-white/15"
                  : canManage
                    ? "border-white/35 bg-black/10 text-white/90 hover:bg-white/10"
                    : "border-white/35 bg-black/10 text-white/90"
              }`}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center px-1 py-1 sm:h-15 sm:w-15 sm:px-3 sm:py-2">
                <span className="text-xs font-bold tracking-wide sm:text-sm">
                  {slot.label}
                </span>
                {player && (
                  <span className="mt-0.5 max-w-11 truncate text-[11px] font-medium text-white/90 sm:mt-1 sm:max-w-[88px] sm:text-sm">
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
