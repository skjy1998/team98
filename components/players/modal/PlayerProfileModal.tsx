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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:px-4 md:py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="프로필 닫기"
        className="absolute inset-0 bg-black/35"
      />

      <dialog
        open
        aria-label={`${player.name} 선수 프로필`}
        className="relative z-10 m-0 max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border-0 bg-white shadow-2xl md:max-h-[90vh] md:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="px-4 pb-4 pt-6 pr-12 sm:px-6 sm:pb-6 sm:pt-8 sm:pr-14">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              {player.name}
            </h2>
            {player.number !== undefined && (
              <span className="text-sm font-semibold text-emerald-700">
                #{player.number}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-500 sm:mt-2 sm:text-sm">
            {profileDetails}
          </p>
        </header>

        <div className="grid grid-cols-4 border-y border-stone-100 py-4 sm:py-5">
          {[
            { label: "출전", value: player.appearance },
            { label: "득점", value: player.goal },
            { label: "도움", value: player.assist },
            { label: "MVP", value: mvpCount },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs text-stone-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-stone-900 sm:text-xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <section className="px-4 py-4 sm:px-6 sm:py-6">
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
                  className="flex items-center justify-between gap-2 py-2.5 sm:gap-4 sm:py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {match.title}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">{match.date}</p>
                  </div>
                  <p className="shrink-0 text-xs text-stone-600 sm:text-sm">
                    득점 {match.goal} · 도움 {match.assist}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {onEdit && (
          <div className="sticky bottom-0 flex justify-end border-t border-stone-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={() => onEdit(player)}
              className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              선수 정보 수정
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
