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
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">선수 선택</h3>
        <span className="text-sm text-stone-400">
          {playersLoaded ? `${availablePlayers.length}명` : ""}
        </span>
      </div>

      <div className="mt-4 max-h-[400px] space-y-2 overflow-y-auto pr-1">
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
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  player.isRecommended
                    ? "border-emerald-300 bg-emerald-100 hover:bg-emerald-200/80"
                    : "border-stone-200 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      player.isRecommended
                        ? "text-emerald-800"
                        : "text-stone-900"
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
                <div className="flex min-w-[120px] justify-end">
                  <div className="flex items-center gap-2">
                    {player.isRecommended && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                        추천
                      </span>
                    )}

                    <span className="text-sm text-stone-400">
                      {player.number ? `#${player.number}` : "등번호 없음"}
                    </span>
                  </div>
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
