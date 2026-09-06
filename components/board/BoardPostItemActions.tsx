import { ChevronDown, Pencil, Pin, Trash2 } from "lucide-react";

interface BoardPostItemActionsProps {
  title: string;
  contentId: string;
  isExpanded: boolean;
  isPinned: boolean;
  canEdit: boolean;
  canPin: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onTogglePin: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function BoardPostItemActions({
  title,
  contentId,
  isExpanded,
  isPinned,
  canEdit,
  canPin,
  onToggle,
  onEdit,
  onTogglePin,
  onDelete,
}: Readonly<BoardPostItemActionsProps>) {
  return (
    <div className="flex shrink-0 items-center gap-1 py-5 pr-5">
      {isExpanded && canPin && (
        <button
          type="button"
          onClick={() => void onTogglePin()}
          aria-label={
            isPinned ? `${title} 게시물 고정 해제` : `${title} 게시물 상단 고정`
          }
          title={isPinned ? "고정 해제" : "상단 고정"}
          className={[
            "flex h-9 w-9 items-center justify-center rounded-lg transition",
            isPinned
              ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
              : "text-stone-400 hover:bg-amber-50 hover:text-amber-600",
          ].join(" ")}
        >
          <Pin
            className={["h-4 w-4", isPinned ? "fill-current" : ""].join(" ")}
          />
        </button>
      )}

      {isExpanded && canEdit && (
        <>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${title} 게시물 수정`}
            title="수정"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => void onDelete()}
            aria-label={`${title} 게시물 삭제`}
            title="삭제"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}

      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        aria-label={isExpanded ? "게시물 접기" : "게시물 펼치기"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-300 transition hover:bg-stone-100 hover:text-stone-600"
      >
        <ChevronDown
          className={[
            "h-5 w-5 transition duration-200",
            isExpanded ? "rotate-180 text-stone-600" : "",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
