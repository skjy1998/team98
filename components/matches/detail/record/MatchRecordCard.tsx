import type { MatchRecordEvent, MatchType } from "@/types/match";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface MatchRecordCardProps {
  matchType: MatchType;
  event: MatchRecordEvent;
  isEditing: boolean;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  canManage: boolean;
}

function getRecordDisplay(matchType: MatchType, event: MatchRecordEvent) {
  const isSelfMatch = matchType === "자체전";
  const isGoalEvent = event.type === "goal";

  let scoreLabel = "실점";

  if (isSelfMatch) {
    scoreLabel = isGoalEvent ? "A팀 득점" : "B팀 득점";
  } else if (isGoalEvent) {
    scoreLabel = "득점";
  }

  const canDisplayPlayer = isGoalEvent || isSelfMatch;

  const title = canDisplayPlayer
    ? event.playerName || `${scoreLabel}자 미지정`
    : "상대팀 득점";

  const meta = [
    event.quarter && event.quarter !== "unknown"
      ? event.quarter
      : "쿼터 미지정",
    event.minute ? `${event.minute}분` : null,
    canDisplayPlayer && event.assistPlayerName
      ? `A: ${event.assistPlayerName}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    isGoalEvent,
    scoreLabel,
    title,
    meta,
  };
}

export default function MatchRecordCard({
  matchType,
  event,
  isEditing,
  isDragging = false,
  onEdit,
  onDelete,
  canManage,
}: Readonly<MatchRecordCardProps>) {
  const { isGoalEvent, scoreLabel, title, meta } = getRecordDisplay(
    matchType,
    event,
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: event.id,
      disabled: !canManage,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border px-3.5 py-3.5 transition sm:rounded-2xl sm:px-5 sm:py-4 ${
        isDragging
          ? "scale-[1.01] border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100"
          : isEditing
            ? "border-emerald-300 bg-emerald-50/40 ring-2 ring-emerald-100"
            : "border-stone-200 bg-stone-100/70 hover:border-stone-300"
      }`}
    >
      <div className="flex items-stretch gap-2 sm:gap-3">
        {canManage && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex shrink-0 touch-none select-none items-center self-stretch px-0.5 text-stone-300 transition hover:text-stone-500 sm:px-1"
            aria-label="기록 순서 변경"
          >
            <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${
                    isGoalEvent
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {scoreLabel}
                </span>

                <p className="truncate text-base font-semibold text-stone-900 sm:text-lg">
                  {title}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-stone-500 sm:mt-3 sm:text-sm">
            {meta}
          </p>
        </div>

        {canManage && (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onEdit}
              disabled={!onEdit}
              className="rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-[11px] font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
            >
              {isEditing ? "닫기" : "수정"}
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={!onDelete}
              className="rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-xs"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
