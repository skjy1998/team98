import {
  getMainPositionFromDetail,
  getPlayerBadges,
  getPositionBadgeClassName,
} from "@/lib/players/player-ui";
import type { PlayerType } from "@/types/player";
import { Pencil, Trash2 } from "lucide-react";

interface PlayerListItemProps {
  player: PlayerType;
  onEdit?: (player: PlayerType) => void;
  onDelete?: (player: PlayerType) => void;
}

export default function PlayerListItem({
  player,
  onEdit,
  onDelete,
}: Readonly<PlayerListItemProps>) {
  const mainPosition = getMainPositionFromDetail(player.detailPositions);
  const badges = getPlayerBadges(player);

  return (
    <div className="rounded-[22px] px-3 py-3 transition hover:bg-stone-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100">
            <span className="text-sm font-semibold text-stone-700">
              {player.number ?? player.name.slice(0, 1)}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-[15px] font-semibold text-stone-900">
                {player.name}
              </p>

              {badges.map((badge) => (
                <span
                  key={`${player.id}-${badge.label}`}
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}

              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPositionBadgeClassName(mainPosition)}`}
              >
                {mainPosition || player.position || "포지션 미지정"}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
              <span>출전 {player.appearance}</span>
              <span>·</span>
              <span>득점 {player.goal}</span>
              <span>·</span>
              <span>어시스트 {player.assist}</span>
            </div>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 items-center gap-0.5">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(player)}
                className="rounded-full p-2 text-stone-400 transition hover:bg-white hover:text-stone-700"
                aria-label={`${player.name} 수정`}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(player)}
                className="rounded-full p-2 text-stone-400 transition hover:bg-white hover:text-red-500"
                aria-label={`${player.name} 삭제`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
