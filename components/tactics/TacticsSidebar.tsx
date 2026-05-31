import { PlayerType } from "@/types/player";
import { FormationSlot } from "@/types/tactics";

interface TacticsSidebarProps {
  loaded: boolean;
  players: PlayerType[];
  availablePlayers: PlayerType[];
  selectedSlot?: FormationSlot;
  selectedSlotId: string | null;
  onAssignPlayer: (playerId: string) => void;
  onClearSlot: () => void;
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  cornerKickPlayerId: string;
  freeKickPlayerId: string;
  penaltyKickPlayerId: string;
  onChangeCornerKickPlayerId: (value: string) => void;
  onChangeFreeKickPlayerId: (value: string) => void;
  onChangePenaltyKickPlayerId: (value: string) => void;
  cornerKickPlayer?: PlayerType;
  freeKickPlayer?: PlayerType;
  penaltyKickPlayer?: PlayerType;
}

export default function TacticsSidebar({
  loaded,
  players,
  availablePlayers,
  selectedSlot,
  selectedSlotId,
  onAssignPlayer,
  onClearSlot,
  getPlayerById,
  cornerKickPlayerId,
  freeKickPlayerId,
  penaltyKickPlayerId,
  onChangeCornerKickPlayerId,
  onChangeFreeKickPlayerId,
  onChangePenaltyKickPlayerId,
  cornerKickPlayer,
  freeKickPlayer,
  penaltyKickPlayer,
}: Readonly<TacticsSidebarProps>) {
  return (
    <aside className="space-y-4">
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
                  ? `${getPlayerById(selectedSlot.playerId)?.name ?? ""} 배치됨`
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

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-900">선수 선택</h3>
          <span className="text-sm text-stone-400">
            {loaded ? `${availablePlayers.length}명` : ""}
          </span>
        </div>

        <div className="mt-4 max-h-[400px] space-y-2 overflow-y-auto pr-1">
          {!loaded ? (
            <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              선수 목록을 불러오는 중...
            </div>
          ) : availablePlayers.length === 0 ? (
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
          )}
        </div>
      </section>
      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-stone-900">전담 키커</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="corner-kicker"
              className="text-sm font-medium text-stone-500"
            >
              코너킥
            </label>
            <select
              id="corner-kicker"
              value={cornerKickPlayerId}
              onChange={(e) => onChangeCornerKickPlayerId(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
            >
              <option value="">선택 안 함</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
              {cornerKickPlayer
                ? cornerKickPlayer.name
                : "선택된 선수가 없습니다."}
            </div>
          </div>

          <div>
            <label
              htmlFor="free-kick-kicker"
              className="text-sm font-medium text-stone-500"
            >
              프리킥
            </label>
            <select
              id="free-kick-kicker"
              value={freeKickPlayerId}
              onChange={(e) => onChangeFreeKickPlayerId(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
            >
              <option value="">선택 안 함</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
              {freeKickPlayer ? freeKickPlayer.name : "선택된 선수가 없습니다."}
            </div>
          </div>

          <div>
            <label
              htmlFor="penalty-kicker"
              className="text-sm font-medium text-stone-500"
            >
              페널티킥
            </label>
            <select
              id="penalty-kicker"
              value={penaltyKickPlayerId}
              onChange={(e) => onChangePenaltyKickPlayerId(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
            >
              <option value="">선택 안 함</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
              {penaltyKickPlayer
                ? penaltyKickPlayer.name
                : "선택된 선수가 없습니다."}
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
