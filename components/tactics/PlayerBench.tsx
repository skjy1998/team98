import { PlayerType } from "@/types/player";
import { FormationSlot } from "@/types/tactics";

interface PlayerBenchProps {
  loaded: boolean;
  players: PlayerType[];
  selectedSlot: FormationSlot | undefined;
  selectedSlotId: string | null;
  onAssignPlayer: (playerId: string) => void;
  onClearSlot: () => void;
  listMaxHeightClassName?: string;
}

export default function PlayerBench({
  loaded,
  players,
  selectedSlot,
  selectedSlotId,
  onAssignPlayer,
  onClearSlot,
  listMaxHeightClassName = "max-h-[560px]",
}: Readonly<PlayerBenchProps>) {
  return (
    <aside className="rounded-xl border bg-white p-5">
      <h2 className="font-bold">선수 목록</h2>
      <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
        {selectedSlot
          ? `${selectedSlot.label} 슬롯이 선택되었습니다.`
          : "먼저 경기장 슬롯을 선택하세요."}
      </div>
      {selectedSlot?.playerId && (
        <button
          type="button"
          onClick={onClearSlot}
          className="mt-3 w-full rounded-lg border border-red-100 bg-red-50 py-2 text-sm font-bold text-red-500 hover:bg-red-100"
        >
          선택 슬롯 비우기
        </button>
      )}
      <div
        className={`mt-4 ${listMaxHeightClassName} space-y-2 overflow-y-auto pr-1`}
      >
        {loaded ? (
          players.length > 0 ? (
            players.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => onAssignPlayer(player.id)}
                disabled={selectedSlotId === null}
                className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="font-bold">{player.name}</span>
                <span className="text-gray-500">
                  {player.position} · {player.number}
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
              배치 가능한 선수가 없습니다.
            </div>
          )
        ) : (
          <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
            선수 목록을 불러오는 중...
          </div>
        )}
      </div>
    </aside>
  );
}
