import { playerPositions } from "@/types/player";

interface PlayerToolbarProps {
  search: string;
  positions: string[];
  onAdd: () => void;
  onSearchChange: (value: string) => void;
  onTogglePosition: (position: string) => void;
}

export default function PlayerToolbar({
  search,
  positions,
  onAdd,
  onSearchChange,
  onTogglePosition,
}: Readonly<PlayerToolbarProps>) {
  return (
    <div className="flex gap-2">
      <input
        placeholder="선수 이름 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 border px-5 py-2 rounded-lg text-sm"
      />

      <div className="flex gap-2">
        {playerPositions.map((position) => {
          const isActive = positions.includes(position);

          return (
            <button
              key={position}
              type="button"
              onClick={() => onTogglePosition(position)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                isActive
                  ? "bg-green-500 text-white ring-2 ring-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {position}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm whitespace-nowrap"
      >
        + 선수 추가
      </button>
    </div>
  );
}
