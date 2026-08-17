"use client";

import { getSettingsTab } from "@/lib/settings/settings-ui";
import type { SettingsTab } from "@/types/settings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../PageHeader";
import SettingsTabs from "./SettingsTabs";
import ProfileSettingsTab from "./profile/ProfileSettingsTab";
import TeamSettingsTab from "./team/TeamSettingsTab";
import SeasonSettingsTab from "./season/SeasonSettingsTab";

export default function SettingsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = getSettingsTab(searchParams.get("tab"));

  const handleChangeTab = (tab: SettingsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="설정"
        description="내 계정과 팀 운영 환경을 관리하세요."
      />

      <SettingsTabs activeTab={activeTab} onChangeTab={handleChangeTab} />

      {activeTab === "profile" && <ProfileSettingsTab />}

      {activeTab === "team" && <TeamSettingsTab />}

      {activeTab === "season" && <SeasonSettingsTab />}
    </div>
  );
}
