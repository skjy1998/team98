import { CurrentTeamProvider } from "@/components/providers/CurrentTeamProvider";
import TeamAddPageClient from "@/components/team/TeamAddPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 팀 추가 | SquadFlow",
  description: "새 팀을 만들거나 초대 코드로 기존 팀에 참가하세요.",
};

export default function TeamAddPage() {
  return (
    <CurrentTeamProvider>
      <TeamAddPageClient />
    </CurrentTeamProvider>
  );
}
