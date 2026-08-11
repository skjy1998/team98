import SettingsPageClient from "@/components/settings/SettingsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정 | SquadFlow",
  description: "내 계정과 팀 운영 환경을 관리하세요.",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
