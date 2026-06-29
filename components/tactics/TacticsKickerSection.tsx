import type { PlayerType } from "@/types/player";

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
  const kickerFields = [
    {
      id: "corner-kicker",
      label: "코너킥",
      value: cornerKickPlayerId,
      onChange: onChangeCornerKickPlayerId,
      player: cornerKickPlayer,
    },
    {
      id: "freekick-kicker",
      label: "프리킥",
      value: freeKickPlayerId,
      onChange: onChangeFreeKickPlayerId,
      player: freeKickPlayer,
    },
    {
      id: "penalty-kicker",
      label: "페널티킥",
      value: penaltyKickPlayerId,
      onChange: onChangePenaltyKickPlayerId,
      player: penaltyKickPlayer,
    },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-stone-900">전담 키커</h3>

      <div className="mt-4 space-y-4">
        {kickerFields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="text-sm font-medium text-stone-500"
            >
              {field.label}
            </label>

            <select
              id={field.id}
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
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
              {field.player ? field.player.name : "선택된 선수가 없습니다."}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
