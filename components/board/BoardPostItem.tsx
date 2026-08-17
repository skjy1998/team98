import { formatPostDate } from "@/lib/board/board-ui";
import type { TeamPost } from "@/types/board";
import type { ReactNode } from "react";
import {
  ChevronDown,
  Eye,
  MessageCircle,
  Pencil,
  Pin,
  Trash2,
} from "lucide-react";

interface BoardPostItemProps {
  post: TeamPost;
  isExpanded: boolean;
  canEdit: boolean;
  canPin: boolean;
  commentCount: number;
  commentsLoaded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onTogglePin: () => Promise<void>;
  onDelete: () => Promise<void>;
  children: ReactNode;
}

export default function BoardPostItem({
  post,
  isExpanded,
  canEdit,
  canPin,
  commentCount,
  commentsLoaded,
  onToggle,
  onEdit,
  onTogglePin,
  onDelete,
  children,
}: Readonly<BoardPostItemProps>) {
  const contentId = `board-post-content-${post.id}`;

  return (
    <article
      className={[
        "overflow-hidden rounded-xl border shadow-sm transition",
        isExpanded
          ? "border-emerald-200 shadow-md"
          : "border-stone-200 hover:border-stone-300",
        post.isPinned ? "bg-amber-50/40" : "bg-white",
      ].join(" ")}
    >
      <div className="flex items-start">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={onToggle}
          className="group flex min-w-0 flex-1 items-start gap-4 px-5 py-5 text-left transition hover:bg-stone-50/70"
        >
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
              post.type === "notice"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-sky-50 text-sky-600",
            ].join(" ")}
          >
            {post.type === "notice" ? "공지" : "일반"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {post.isPinned && (
                <Pin className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              )}

              <p className="truncate font-semibold text-stone-900 transition group-hover:text-emerald-700">
                {post.title}
              </p>
            </div>

            {!isExpanded && (
              <p className="mt-2 line-clamp-1 text-sm text-stone-400">
                {post.content}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-400">
              <span>{post.authorName}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.createdAt}>
                {formatPostDate(post.createdAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewCount}
              </span>
              <span aria-hidden="true">·</span>

              <span
                className="inline-flex items-center gap-1"
                aria-label={`댓글 ${commentCount}개`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {commentsLoaded ? commentCount : "-"}
              </span>
            </div>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1 py-5 pr-5">
          {isExpanded && (
            <>
              {canPin && (
                <button
                  type="button"
                  onClick={onTogglePin}
                  aria-label={
                    post.isPinned
                      ? `${post.title} 게시물 고정 해제`
                      : `${post.title} 게시물 상단 고정`
                  }
                  title={post.isPinned ? "고정 해제" : "상단 고정"}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-lg transition",
                    post.isPinned
                      ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                      : "text-stone-400 hover:bg-amber-50 hover:text-amber-600",
                  ].join(" ")}
                >
                  <Pin
                    className={[
                      "h-4 w-4",
                      post.isPinned ? "fill-current" : "",
                    ].join(" ")}
                  />
                </button>
              )}
              {canEdit && (
                <>
                  <button
                    type="button"
                    onClick={onEdit}
                    aria-label={`${post.title} 게시물 수정`}
                    title="수정"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`${post.title} 게시물 삭제`}
                    title="삭제"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
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
      </div>

      {isExpanded && (
        <div
          id={contentId}
          className="border-t border-stone-100 px-5 pb-6 pt-5 md:pl-[76px] md:pr-10"
        >
          <div
            className={[
              "whitespace-pre-wrap text-sm leading-7 text-stone-700",
              canEdit ? "pr-20" : "",
            ].join(" ")}
          >
            {post.content}
          </div>
          {children}
        </div>
      )}
    </article>
  );
}
