import ContentState from "@/components/common/ContentState";
import type { PlayerType } from "@/types/player";
import PlayerListItem from "./PlayerListItem";

interface PlayerTableProps {
  players: PlayerType[];
  onEdit?: (player: PlayerType) => void;
  onDelete?: (player: PlayerType) => void;
}

export default function PlayerTable({
  players,
  onEdit,
  onDelete,
}: Readonly<PlayerTableProps>) {
  if (players.length === 0) {
    return (
      <ContentState
        variant="empty"
        title="조건에 맞는 선수가 없어요."
        description="검색어나 정렬 조건을 다시 확인해 보세요."
      />
    );
  }
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 md:p-4">
      <div className="grid gap-2.5 md:grid-cols-2">
        {players.map((player) => (
          <PlayerListItem
            key={player.id}
            player={player}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
