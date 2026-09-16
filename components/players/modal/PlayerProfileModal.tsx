import { useEscapeKey } from "@/hooks/common/useEscapeKey";
import type { PlayerType } from "@/types/player";
import type { PlayerRecentMatch } from "@/types/stats";
import { X } from "lucide-react";

interface PlayerProfileModalProps {
  player: PlayerType;
  onClose: () => void;
  onEdit?: (player: PlayerType) => void;
  mvpCount: number;
  recentMatches: PlayerRecentMatch[];
}

export default function PlayerProfileModal({
  player,
  onClose,
  onEdit,
  mvpCount,
  recentMatches,
}: Readonly<PlayerProfileModalProps>) {
  useEscapeKey(onClose);

  const roleLabel =
    player.role === "captain"
      ? "주장"
      : player.role === "viceCaptain"
        ? "부주장"
        : null;

  const positionLabel = player.detailPositions?.length
    ? player.detailPositions.join(" · ")
    : player.position || "포지션 미지정";

  const footLabel = player.preferredFoot
    ? {
        right: "오른발",
        left: "왼발",
        both: "양발",
      }[player.preferredFoot]
    : null;

  const profileDetails = [roleLabel, positionLabel, footLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="프로필 닫기"
        className="absolute inset-0 bg-black/35"
      />

      <dialog
        open
        aria-label={`${player.name} 선수 프로필`}
        className="relative z-10 m-0 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border-0 bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-5 top-5 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="px-6 pb-6 pt-8 pr-14">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {player.name}
            </h2>
            {player.number !== undefined && (
              <span className="text-sm font-semibold text-emerald-700">
                #{player.number}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-stone-500">{profileDetails}</p>
        </header>

        <div className="grid grid-cols-4 border-y border-stone-100 py-5">
          {[
            { label: "출전", value: player.appearance },
            { label: "득점", value: player.goal },
            { label: "도움", value: player.assist },
            { label: "MVP", value: mvpCount },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs text-stone-500">{item.label}</p>
              <p className="mt-1 text-xl font-bold text-stone-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <section className="px-6 py-6">
          <h3 className="text-sm font-semibold text-stone-900">최근 5경기</h3>

          {recentMatches.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-500">
              아직 확인할 경기 기록이 없어요.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-stone-100">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {match.title}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">{match.date}</p>
                  </div>
                  <p className="shrink-0 text-sm text-stone-600">
                    득점 {match.goal} · 도움 {match.assist}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {onEdit && (
          <div className="flex justify-end border-t border-stone-100 px-6 py-4">
            <button
              type="button"
              onClick={() => onEdit(player)}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              선수 정보 수정
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
