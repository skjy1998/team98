import type { PlayerType } from "@/types/player";
import { ChevronDown } from "lucide-react";

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
  canManage: boolean;
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
  canManage,
}: Readonly<TacticsKickerSectionProps>) {
  const kickerFields = [
    {
      id: "corner-kicker",
      label: "코너킥",
      value: cornerKickPlayerId,
      onChange: onChangeCornerKickPlayerId,
      selectedPlayer: cornerKickPlayer,
    },
    {
      id: "freekick-kicker",
      label: "프리킥",
      value: freeKickPlayerId,
      onChange: onChangeFreeKickPlayerId,
      selectedPlayer: freeKickPlayer,
    },
    {
      id: "penalty-kicker",
      label: "페널티킥",
      value: penaltyKickPlayerId,
      onChange: onChangePenaltyKickPlayerId,
      selectedPlayer: penaltyKickPlayer,
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
            <div className="relative mt-2">
              <select
                id={field.id}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                disabled={!canManage}
                className={`h-12 w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none ${
                  canManage
                    ? "border-stone-200 bg-white text-stone-800 focus:border-emerald-300"
                    : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                }`}
              >
                <option value="">선택 안 함</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                  canManage ? "text-stone-400" : "text-stone-300"
                }`}
              />
            </div>

            <div className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
              {field.selectedPlayer
                ? field.selectedPlayer.name
                : "선택된 선수가 없습니다."}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
