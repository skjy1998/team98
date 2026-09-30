"use client";

import TeamInviteCodeCard from "@/components/settings/team/TeamInviteCodeCard";
import TeamProfileForm from "@/components/settings/team/TeamProfileForm";
import TeamRoleCard from "@/components/settings/team/TeamRoleCard";
import type { CurrentTeam, TeamSport } from "@/types/team";
import { useState } from "react";

const initialTeam: CurrentTeam = {
  id: "demo-team",
  name: "스쿼드FC",
  sport: "soccer",
  inviteCode: "SQUAD-2026",
  memberRole: "owner",
};

export default function DemoTeamSettingsTab() {
  const [team, setTeam] = useState(initialTeam);

  const handleSaveTeam = async (name: string, sport: TeamSport) => {
    setTeam((current) => ({
      ...current,
      name,
      sport,
    }));
    return true;
  };

  const handleRegenerateInviteCode = async () => {
    setTeam((current) => ({
      ...current,
      inviteCode: `SQUAD-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    }));
    return true;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <TeamProfileForm team={team} canManage onSave={handleSaveTeam} />

      <TeamRoleCard role="owner" />

      <TeamInviteCodeCard
        inviteCode={team.inviteCode}
        canRegenerate
        onRegenerate={handleRegenerateInviteCode}
      />
    </div>
  );
}
