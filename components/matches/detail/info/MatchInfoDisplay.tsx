import { matchSportMap, typeMap } from "@/lib/matches/match-display";
import { formatMatchDate } from "@/lib/matches/match-time";

import { formatVoteDeadline } from "@/lib/matches/match-vote";
import type { MatchItem } from "@/types/match";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Settings2,
  Shirt,
  Trash2,
  Vote,
} from "lucide-react";

interface MatchInfoDisplayProps {
  match: MatchItem;
  onEdit: () => void;
  onDelete: () => void;
  canManage: boolean;
}

export default function MatchInfoDisplay({
  match,
  onEdit,
  onDelete,
  canManage,
}: Readonly<MatchInfoDisplayProps>) {
  const sport = matchSportMap[match.sport];
  const uniformLabel = match.uniform === "home" ? "홈 유니폼" : "원정 유니폼";

  const scheduleItems = [
    {
      label: "경기 날짜",
      value: formatMatchDate(match.date),
      icon: CalendarDays,
    },
    {
      label: "경기 시간",
      value: `${match.startTime} - ${match.endTime}`,
      icon: Clock3,
    },
    {
      label: "경기 장소",
      value: match.location || "장소 미정",
      icon: MapPin,
    },
  ];

  const matchFormatText = [
    `${match.playersPerSide}대${match.playersPerSide}`,
    `${match.quarterCount}쿼터`,
    `쿼터당 ${match.quarterDurationMinutes}분`,
  ].join(" · ");

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">경기 정보</h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${sport.className}`}
            >
              {sport.label}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeMap[match.type]}`}
            >
              {match.type}
            </span>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              aria-label="경기 정보 수정"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-100"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onDelete}
              aria-label="경기 삭제"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {scheduleItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-4 rounded-xl bg-stone-50 px-4 py-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-stone-500 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-400">
                    {item.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-stone-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-stone-200 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
              <Settings2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-400">경기 구성</p>
              <p className="mt-1 truncate text-sm font-semibold text-stone-900">
                {matchFormatText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <Vote className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-emerald-600">투표 마감</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {formatVoteDeadline(match.voteDeadline)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-stone-200 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
              <Shirt className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-stone-400">유니폼</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {uniformLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
