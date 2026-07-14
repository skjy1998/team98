import type { Metadata } from "next";
import PlayersPageClient from "@/components/players/PlayersPageClient";

export const metadata: Metadata = {
  title: "선수 관리 | SquadFlow",
  description: "등록된 선수 목록을 확인하고 관리하세요.",
};

export default function PlayersPage() {
  return <PlayersPageClient />;
}
