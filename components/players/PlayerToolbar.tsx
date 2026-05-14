import { playerPositions } from "@/types/player";

interface Props {
  search: string;
  positions: string[];
  onSearchChange: (value: string) => void;
  onTogglePosition: (position: string) => void;
  onOpen: () => void;
}

export default function PlayerToolbar({
  search,
  positions,
  onSearchChange,
  onTogglePosition,
  onOpen,
}: Readonly<Props>) {
  return (
    <div className="flex gap-2">
      <input
        placeholder="선수 이름 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 border px-5 py-2 rounded-lg text-sm"
      />
      {/* position select */}
      <div className="flex gap-2">
        {playerPositions.map((pos) => {
          const isActive = positions.includes(pos);
          return (
            <button
              key={pos}
              onClick={() => onTogglePosition(pos)}
              className={`px-4 py-2 rounded-full text-sm transition
              ${
                isActive
                  ? "bg-green-500 text-white ring-2 ring-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
              `}
            >
              {pos}
            </button>
          );
        })}
      </div>
      {/* player enroll */}
      <button
        onClick={onOpen}
        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm whitespace-nowrap"
      >
        + 선수 추가
      </button>
    </div>
  );
}
