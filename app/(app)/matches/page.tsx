import { Metadata } from "next";
import MatchesPageClient from "@/components/matches/MatchesPageClient";

export const metadata: Metadata = {
  title: "경기 일정 | SquadFlow",
  description: "등록된 경기 일정을 확인하고 관리하세요.",
};

export default function MatchesPage() {
  return <MatchesPageClient />;
}
