import type { PlayerType } from "@/types/player";

interface TacticsPlayerListProps {
  playersLoaded: boolean;
  availablePlayers: (PlayerType & { isRecommended?: boolean })[];
  selectedSlotId: string | null;
  onAssignPlayer: (playerId: string) => void;
  emptyMessage?: string;
  canManage: boolean;
}

export default function TacticsPlayerList({
  playersLoaded,
  availablePlayers,
  selectedSlotId,
  onAssignPlayer,
  emptyMessage = "배치 가능한 선수가 없습니다.",
  canManage,
}: Readonly<TacticsPlayerListProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
          선수 선택
        </h3>
        <span className="text-xs text-stone-400 sm:text-sm">
          {playersLoaded ? `${availablePlayers.length}명` : ""}
        </span>
      </div>

      <div className="mt-3 max-h-[42dvh] space-y-2 overflow-y-auto pr-1 sm:mt-4 sm:max-h-[400px]">
        {!canManage ? (
          <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            선수 배치는 운영진만 수정할 수 있어요.
          </div>
        ) : playersLoaded ? (
          availablePlayers.length === 0 ? (
            <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              {emptyMessage}
            </div>
          ) : (
            availablePlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => onAssignPlayer(player.id)}
                disabled={selectedSlotId === null}
                className={`flex min-w-0 w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition sm:px-4 ${
                  player.isRecommended
                    ? "border-emerald-300 bg-emerald-100 hover:bg-emerald-200/80"
                    : "border-stone-200 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="min-w-0">
                  <span
                    className={`block truncate text-sm font-semibold ${
                      player.isRecommended
                        ? "text-emerald-800"
                        : "text-stone-900"
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {player.isRecommended && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                      추천
                    </span>
                  )}

                  <span className="text-xs text-stone-400 sm:text-sm">
                    {player.number != null
                      ? `#${player.number}`
                      : "등번호 없음"}
                  </span>
                </div>
              </button>
            ))
          )
        ) : (
          <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
            선수 목록을 불러오는 중...
          </div>
        )}
      </div>
    </section>
  );
}
