import type { DashboardTodoItem } from "@/types/dashboard";
import Link from "next/link";
import DashboardTodoList from "./DashboardTodoList";

interface DashboardTodoSectionProps {
  items: DashboardTodoItem[];
}

export default function DashboardTodoSection({
  items,
}: Readonly<DashboardTodoSectionProps>) {
  const visibleItems = items.slice(0, 4);
  const hasMoreItems = items.length > visibleItems.length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">내 할 일</span>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
            {items.length}개
          </span>
          {hasMoreItems && (
            <Link
              href="/todos"
              className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
            >
              전체 할 일 보기
            </Link>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-5 py-8 text-center">
          <p className="text-sm font-medium text-stone-500">
            지금 처리할 일이 없어요.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            새로운 할 일이 생기면 여기에 표시돼요.
          </p>
        </div>
      ) : (
        <DashboardTodoList items={visibleItems} />
      )}
    </section>
  );
}
