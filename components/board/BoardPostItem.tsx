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
