"use client";

import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import PageHeader from "../PageHeader";
import ContentState from "../common/ContentState";
import DashboardTodoList from "../dashboard/DashboardTodoList";

export default function TodoPageClient() {
  const { todoData, isLoaded } = useDashboardData();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      <PageHeader
        title="전체 할 일"
        description="경기, 회비, 팀 운영과 관련된 할 일을 확인하세요."
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">처리할 항목</h2>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
            {todoData.items.length}개
          </span>
        </div>

        {todoData.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-5 py-10 text-center">
            <p className="text-sm font-medium text-stone-500">
              지금 처리할 일이 없어요.
            </p>
            <p className="mt-1 text-xs text-stone-400">
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
