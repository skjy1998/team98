"use client";

import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import PageHeader from "../PageHeader";
import ContentState from "../common/ContentState";
import DashboardTodoList from "../dashboard/DashboardTodoList";

export default function TodoPageClient() {
  const { todoData, isLoaded } = useDashboardData();

  if (!isLoaded) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="전체 할 일"
          description="경기, 회비, 팀 운영과 관련된 할 일을 확인하세요."
        />

        <ContentState
          variant="loading"
          title="할 일을 불러오는 중..."
          description="팀 활동 정보를 확인하고 있어요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="전체 할 일"
        description="경기, 회비, 팀 운영과 관련된 할 일을 확인하세요."
      />

      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-stone-900 sm:text-sm">
            처리할 항목
          </h2>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500 sm:px-3 sm:text-xs">
            {todoData.items.length}개
          </span>
        </div>

        {todoData.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-4 py-6 text-center sm:px-5 sm:py-10">
            <p className="text-xs font-medium text-stone-500 sm:text-sm">
              지금 처리할 일이 없어요.
            </p>
            <p className="mt-1 text-[11px] text-stone-400 sm:text-xs">
              새로운 할 일이 생기면 여기에 표시돼요.
            </p>
          </div>
        ) : (
          <DashboardTodoList items={todoData.items} />
        )}
      </section>
    </div>
  );
}
