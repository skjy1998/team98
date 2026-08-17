import { formatPostDate } from "@/lib/board/board-ui";
import type { TeamPost } from "@/types/board";
import { ChevronRight, Megaphone, Pin } from "lucide-react";
import Link from "next/link";

interface DashboardNoticeSectionProps {
  notices: TeamPost[];
}

export default function DashboardNoticeSection({
  notices,
}: Readonly<DashboardNoticeSectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">팀 공지</span>

        <Link
          href="/board"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
        >
          전체 보기
        </Link>
      </div>

      {notices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-5 py-8 text-center">
          <p className="text-sm font-medium text-stone-500">
            등록된 공지가 없어요.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            새로운 공지가 등록되면 여기에 표시돼요.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href="/board"
              className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
            >
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  notice.isPinned
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600",
                ].join(" ")}
              >
                {notice.isPinned ? (
                  <Pin className="h-5 w-5 fill-current" />
                ) : (
                  <Megaphone className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-stone-400">
                  {notice.isPinned ? "상단 고정 공지" : "공지사항"}
                </span>

                <p className="mt-1 truncate text-sm font-semibold text-stone-800 transition group-hover:text-emerald-700">
                  {notice.title}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs text-stone-400">
                  <span className="truncate">{notice.authorName}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={notice.createdAt}>
                    {formatPostDate(notice.createdAt)}
                  </time>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
