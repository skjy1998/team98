import type { PlayerType } from "@/types/player";
import type { SetPieceKey } from "@/types/tactics";
import { ChevronDown } from "lucide-react";

interface TacticsKickerSectionProps {
  players: PlayerType[];
  cornerKickPlayerId: string;
  freeKickPlayerId: string;
  penaltyKickPlayerId: string;
  onChangeSetPiecePlayer: (key: SetPieceKey, value: string) => void;
  canManage: boolean;
}

interface KickerField {
  id: string;
  label: string;
  value: string;
  setPieceKey: SetPieceKey;
  selectedPlayer?: PlayerType;
}

export default function TacticsKickerSection({
  players,
  cornerKickPlayerId,
  freeKickPlayerId,
  penaltyKickPlayerId,
  onChangeSetPiecePlayer,
  canManage,
}: Readonly<TacticsKickerSectionProps>) {
  const playerById = new Map(players.map((player) => [player.id, player]));

  const kickerFields: KickerField[] = [
    {
      id: "corner-kicker",
      label: "코너킥",
      value: cornerKickPlayerId,
      setPieceKey: "cornerKickPlayerId",
      selectedPlayer: playerById.get(cornerKickPlayerId),
    },
    {
      id: "freekick-kicker",
      label: "프리킥",
      value: freeKickPlayerId,
      setPieceKey: "freeKickPlayerId",
      selectedPlayer: playerById.get(freeKickPlayerId),
    },
    {
      id: "penalty-kicker",
      label: "페널티킥",
      value: penaltyKickPlayerId,
      setPieceKey: "penaltyKickPlayerId",
      selectedPlayer: playerById.get(penaltyKickPlayerId),
    },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4">
      <h3 className="text-base font-semibold text-stone-900 sm:text-lg">
        전담 키커
      </h3>

      <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
        {kickerFields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="text-xs font-medium text-stone-500 sm:text-sm"
            >
              {field.label}
            </label>
            <div className="relative mt-2">
              <select
                id={field.id}
                value={field.value}
                onChange={(event) =>
                  onChangeSetPiecePlayer(field.setPieceKey, event.target.value)
                }
                disabled={!canManage}
                className={`h-11 w-full appearance-none rounded-xl border px-3 pr-10 text-sm outline-none sm:h-12 sm:px-4 ${
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
                aria-hidden="true"
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                  canManage ? "text-stone-400" : "text-stone-300"
                }`}
              />
            </div>

            <output
              htmlFor={field.id}
              className="mt-1.5 block rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600 sm:mt-2 sm:text-sm"
            >
              {field.selectedPlayer?.name ?? "선택된 선수가 없습니다."}
            </output>
          </div>
        ))}
      </div>
    </section>
  );
}
