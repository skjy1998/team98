import type { PlayerType } from "@/types/player";

interface MatchRecordPlayerPickerProps {
  label: string;
  players: PlayerType[];
  selectedPlayerId: string;
  onChange: (playerId: string) => void;
  allowEmpty?: boolean;
  variant: "scorer" | "assist";
}

export default function MatchRecordPlayerPicker({
  label,
  players,
  selectedPlayerId,
  onChange,
  allowEmpty = false,
  variant,
}: Readonly<MatchRecordPlayerPickerProps>) {
  const activeClassName =
    variant === "scorer"
      ? "bg-amber-500 text-white"
      : "bg-emerald-500 text-white";

  const inactiveClassName =
    variant === "scorer"
      ? "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-stone-700">{label}</p>

      <div className="flex flex-wrap gap-2">
        {allowEmpty && (
          <button
            type="button"
            onClick={() => onChange("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedPlayerId === ""
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            없음
          </button>
        )}

        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => onChange(player.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedPlayerId === player.id
                ? activeClassName
                : inactiveClassName
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
}
