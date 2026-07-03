import type { MatchRecordEvent } from "@/types/match";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface MatchRecordCardProps {
  event: MatchRecordEvent;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MatchRecordCard({
  event,
  isEditing,
  onEdit,
  onDelete,
}: Readonly<MatchRecordCardProps>) {
  const title =
    event.type === "goal" ? event.playerName || "득점자 미지정" : "상대팀 득점";

  const meta = [
    event.quarter && event.quarter !== "unknown"
      ? event.quarter
      : "쿼터 미지정",
    event.minute ? `${event.minute}분` : null,
    event.type === "goal" && event.assistPlayerName
      ? `A: ${event.assistPlayerName}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: event.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border px-5 py-4 transition ${
        isEditing
          ? "border-orange-300 bg-stone-100 ring-2 ring-orange-200"
          : "border-stone-200 bg-stone-100/70 hover:border-stone-300"
      }`}
    >
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex shrink-0 items-center self-stretch px-1 text-stone-300 transition hover:text-stone-500"
          aria-label="기록 순서 변경"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    event.type === "goal"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {event.type === "goal" ? "득점" : "실점"}
                </span>

                <p className="truncate text-lg font-semibold text-stone-900">
                  {title}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-stone-500">{meta}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
          >
            {isEditing ? "닫기" : "수정"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
