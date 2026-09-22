import { formatSeasonDate } from "@/lib/settings/settings-ui";
import type { TeamSeason } from "@/types/seasons";
import { CalendarRange, CheckCircle2, Pencil, Trash2 } from "lucide-react";

interface SeasonListItemDisplayProps {
  season: TeamSeason;
  canManage: boolean;
  isProcessing: boolean;
  onOpenEdit: () => void;
  onSetActive: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

export default function SeasonListItemDisplay({
  season,
  canManage,
  isProcessing,
  onOpenEdit,
  onSetActive,
  onDelete,
}: Readonly<SeasonListItemDisplayProps>) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11",
          season.isActive
            ? "bg-emerald-50 text-emerald-600"
            : "bg-stone-100 text-stone-500",
        ].join(" ")}
      >
        <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-stone-900 sm:text-base">
            {season.name}
          </h3>

          {season.isActive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:px-2.5 sm:py-1 sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              활성 시즌
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-stone-500 sm:mt-2 sm:text-sm">
          {formatSeasonDate(season.startDate)}
          <span className="mx-2 text-stone-300">-</span>
          {season.endDate ? formatSeasonDate(season.endDate) : "종료일 미정"}
        </p>
      </div>

      {canManage && (
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!season.isActive && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onSetActive}
              className="h-8 rounded-lg border border-emerald-200 px-2 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:px-3 sm:text-xs"
            >
              활성화
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={onOpenEdit}
            aria-label={`${season.name} 수정`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50 sm:h-9 sm:w-9"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {!season.isActive && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onDelete}
              aria-label={`${season.name} 삭제`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
