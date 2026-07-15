import type { Metadata } from "next";
import TacticsPageClient from "@/components/tactics/TacticsPageClient";

export const metadata: Metadata = {
  title: "전술 보드 | SquadFlow",
  description: "포메이션을 구성하고 저장된 전술 프리셋을 관리하세요.",
};

export default function TacticsPage() {
  return <TacticsPageClient />;
}
