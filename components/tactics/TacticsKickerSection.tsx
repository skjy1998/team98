import { PlayerType } from "@/types/player";

interface TacticsKickerSectionProps {
  players: PlayerType[];
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

export default function TacticsKickerSection({
  players,
  cornerKickPlayerId,
  freeKickPlayerId,
  penaltyKickPlayerId,
  onChangeCornerKickPlayerId,
  onChangeFreeKickPlayerId,
  onChangePenaltyKickPlayerId,
  cornerKickPlayer,
  freeKickPlayer,
  penaltyKickPlayer,
}: Readonly<TacticsKickerSectionProps>) {
  return (
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
  );
}
