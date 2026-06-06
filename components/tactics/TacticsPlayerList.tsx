import { PlayerType } from "@/types/player";

interface TacticsPlayerListProps {
  loaded: boolean;
  availablePlayers: PlayerType[];
  selectedSlotId: string | null;
  onAssignPlayer: (playerId: string) => void;
}

export default function TacticsPlayerList({
  loaded,
  availablePlayers,
  selectedSlotId,
  onAssignPlayer,
}: Readonly<TacticsPlayerListProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">선수 선택</h3>
        <span className="text-sm text-stone-400">
          {loaded ? `${availablePlayers.length}명` : ""}
        </span>
      </div>

      <div className="mt-4 max-h-[400px] space-y-2 overflow-y-auto pr-1">
        {loaded ? (
          availablePlayers.length === 0 ? (
            <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              배치 가능한 선수가 없습니다.
            </div>
          ) : (
            availablePlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => onAssignPlayer(player.id)}
                disabled={selectedSlotId === null}
                className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-left transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="text-sm font-semibold text-stone-900">
                  {player.name}
                </span>
                <span className="text-sm text-stone-400">
                  {player.number ? `#${player.number}` : "등번호 없음"}
                </span>
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
