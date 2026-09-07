import TeamSetupPageClient from "@/components/team/setup/TeamSetupPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "팀 시작하기 | SquadFlow",
  description: "팀을 만들거나 초대 코드를 통해 기존 팀에 참가하세요.",
};

export default function TeamSetupPage() {
  return <TeamSetupPageClient />;
}
