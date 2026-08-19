import { useTeamSettings } from "@/hooks/settings/useTeamSettings";
import TeamProfileForm from "./TeamProfileForm";
import TeamInviteCodeCard from "./TeamInviteCodeCard";
import TeamRoleCard from "./TeamRoleCard";
import TeamSummaryCard from "./TeamSummaryCard";
import TeamDangerZone from "./TeamDangerZone";
import ContentState from "@/components/common/ContentState";

export default function TeamSettingsTab() {
  const {
    team,
    teamRole,
    teamSummary,
    teamSettingsLoaded,
    teamError,
    canManage,
    updateTeamProfile,
    regenerateInviteCode,
    leaveTeam,
    deleteTeam,
  } = useTeamSettings();

  if (!teamSettingsLoaded) {
    return (
      <ContentState
        variant="loading"
        title="팀 설정을 불러오는 중..."
        description="팀 정보와 운영 설정을 확인하고 있어요."
      />
    );
  }

  if (!team) {
    return (
      <ContentState
        variant="error"
        title="팀 정보를 불러오지 못했어요."
        description={teamError || "잠시 후 다시 시도해 주세요."}
      />
    );
  }

  return (
    <div className="space-y-6">
      {teamError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-700">{teamError}</p>
        </div>
      )}

      <TeamProfileForm
        team={team}
        canManage={canManage}
        onSave={updateTeamProfile}
      />
      <TeamRoleCard role={teamRole} />
      {teamSummary && <TeamSummaryCard summary={teamSummary} />}
      <TeamInviteCodeCard
        inviteCode={team.inviteCode}
        canRegenerate={teamRole === "owner"}
        onRegenerate={regenerateInviteCode}
      />
      {teamRole && (
        <TeamDangerZone
          teamName={team.name}
          role={teamRole}
          onLeaveTeam={leaveTeam}
          onDeleteTeam={deleteTeam}
        />
      )}
    </div>
  );
}
