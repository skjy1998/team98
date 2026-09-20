import type { PlayerType } from "@/types/player";

interface MatchRecordPlayerPickerProps {
  label: string;
  players: PlayerType[];
  selectedPlayerId: string;
  onChange: (playerId: string) => void;
  allowEmpty?: boolean;
}

export default function MatchRecordPlayerPicker({
  label,
  players,
  selectedPlayerId,
  onChange,
  allowEmpty = false,
}: Readonly<MatchRecordPlayerPickerProps>) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold text-stone-700 sm:mb-3 sm:text-sm">
        {label}
      </legend>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {allowEmpty && (
          <button
            type="button"
            aria-pressed={selectedPlayerId === ""}
            onClick={() => onChange("")}
            className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm ${
              selectedPlayerId === ""
                ? "border-stone-700 bg-stone-700 text-white shadow-sm"
                : "border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
            }`}
          >
            없음
          </button>
        )}

        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            aria-pressed={selectedPlayerId === player.id}
            onClick={() => onChange(player.id)}
            className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm ${
              selectedPlayerId === player.id
                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                : "border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
