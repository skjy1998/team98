"use client";

import PageHeader from "@/components/PageHeader";
import SettingsTabs from "@/components/settings/SettingsTabs";
import type { SettingsTab } from "@/types/settings";
import { useState } from "react";
import DemoProfileSettingsTab from "./DemoProfileSettingTab";
import DemoSeasonSettingsTab from "./DemoSeasonSettingsTab";
import DemoTeamSettingsTab from "./DemoTeamSettingsTab";

export default function DemoSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="설정"
        description="내 계정과 팀 운영 환경을 관리하세요."
      />

      <SettingsTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === "profile" && <DemoProfileSettingsTab />}
      {activeTab === "team" && <DemoTeamSettingsTab />}
      {activeTab === "season" && <DemoSeasonSettingsTab />}
    </div>
  );
}
