import { useTeamSettings } from "@/hooks/settings/useTeamSettings";
import TeamProfileForm from "./TeamProfileForm";
import TeamInviteCodeCard from "./TeamInviteCodeCard";
import TeamRoleCard from "./TeamRoleCard";
import TeamSummaryCard from "./TeamSummaryCard";
import TeamDangerZone from "./TeamDangerZone";

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
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
        팀 설정을 불러오는 중...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <p className="text-sm font-medium text-rose-600">
          팀 정보를 불러오지 못했어요.
        </p>
      </div>
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
