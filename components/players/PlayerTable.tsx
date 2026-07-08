import { getMainPositionFromDetail } from "@/lib/player-ui";
import type { PlayerType } from "@/types/player";
import { Pencil, Trash2 } from "lucide-react";

interface PlayerTableProps {
  players: PlayerType[];
  onEdit?: (player: PlayerType) => void;
  onDelete?: (player: PlayerType) => void;
}

const getPositionBadgeClassName = (position?: string) => {
  switch (position) {
    case "GK":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "DF":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "MF":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "FW":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-stone-200 bg-stone-50 text-stone-500";
  }
};

const getPlayerRoleBadge = (role?: string) => {
  if (role === "captain") {
    return {
      label: "주장",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (role === "viceCaptain") {
    return {
      label: "부주장",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }
  return null;
};

const getTeamRoleBadge = (role?: string) => {
  if (role === "owner") {
    return {
      label: "회장",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }

  if (role === "staff") {
    return {
      label: "운영진",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }
  return null;
};

export default function PlayerTable({
  players,
  onEdit,
  onDelete,
}: Readonly<PlayerTableProps>) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white px-6 py-14 text-center">
        <p className="text-base font-semibold text-stone-800">
          조건에 맞는 선수가 없어요.
        </p>
        <p className="mt-2 text-sm text-stone-400">
          검색어나 필터를 다시 확인해보세요.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 md:p-4">
      <div className="grid gap-2.5 md:grid-cols-2">
        {players.map((player) => {
          const mainPosition = getMainPositionFromDetail(
            player.detailPositions,
          );
          const playerRoleBadge = getPlayerRoleBadge(player.role);
          const teamRoleBadge = getTeamRoleBadge(player.teamMemberRole);
          return (
            <div
              key={player.id}
              className="group rounded-[22px] px-3 py-3 transition hover:bg-stone-50"
            >
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
                      {!player.userId && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          미가입
                        </span>
                      )}
                      {teamRoleBadge && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${teamRoleBadge.className}`}
                        >
                          {teamRoleBadge.label}
                        </span>
                      )}
                      {playerRoleBadge && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${playerRoleBadge.className}`}
                        >
                          {playerRoleBadge.label}
                        </span>
                      )}
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPositionBadgeClassName(mainPosition)}`}
                      >
                        {mainPosition || player.position || "포지션 미지정"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
        })}
      </div>
    </div>
  );
}
