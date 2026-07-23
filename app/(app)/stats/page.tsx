import type { Metadata } from "next";
import StatsPageClient from "@/components/stats/StatsPageClient";

export const metadata: Metadata = {
  title: "통계 | SquadFlow",
  description: "팀 전적과 선수 랭킹을 한눈에 확인하세요.",
};

export default function StatsPage() {
  return <StatsPageClient />;
}
