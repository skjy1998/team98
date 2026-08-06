import DashboardPageClient from "@/components/dashboard/DashboardPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "오늘 팀 상태와 주요 지표를 한눈에 확인하세요.",
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
