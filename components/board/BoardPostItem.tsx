import { formatPostDate } from "@/lib/board/board-ui";
import type { TeamPost } from "@/types/board";
import type { ReactNode } from "react";
import { Eye, MessageCircle, Pin } from "lucide-react";
import BoardPostItemActions from "./BoardPostItemActions";

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
        post.isPinned ? "bg-emerald-50/50" : "bg-white",
      ].join(" ")}
    >
      <div className="flex items-start">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={onToggle}
          className="group flex min-w-0 flex-1 items-start gap-3 px-3.5 py-3.5 text-left transition hover:bg-stone-50/70 sm:gap-4 sm:px-5 sm:py-5"
        >
          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs",
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
                <Pin className="h-3.5 w-3.5 shrink-0 fill-emerald-400 text-emerald-400" />
              )}

              <p className="truncate text-sm font-semibold text-stone-900 transition group-hover:text-emerald-700 sm:text-base">
                {post.title}
              </p>
            </div>

            {!isExpanded && (
              <p className="mt-1.5 line-clamp-1 text-xs text-stone-400 sm:mt-2 sm:text-sm">
                {post.content}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-400 sm:mt-3 sm:gap-3 sm:text-xs">
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

        <BoardPostItemActions
          title={post.title}
          contentId={contentId}
          isExpanded={isExpanded}
          isPinned={post.isPinned}
          canEdit={canEdit}
          canPin={canPin}
          onToggle={onToggle}
          onEdit={onEdit}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
        />
      </div>

      {isExpanded && (
        <div
          id={contentId}
          className="border-t border-stone-100 px-3.5 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5 md:pl-[76px] md:pr-10"
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
