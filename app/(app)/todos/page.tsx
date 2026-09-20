import TodoPageClient from "@/components/todos/TodoPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전체 할 일 | SquadFlow",
  description: "팀 활동과 관련된 모든 할 일을 확인하세요.",
};

export default function TodoPage() {
  return <TodoPageClient />;
}
