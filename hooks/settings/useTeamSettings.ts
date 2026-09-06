import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useTeamSettingsActions } from "./useTeamSettingsActions";
import { useTeamSettingsSummary } from "./useTeamSettingsSummary";

export function useTeamSettings() {
  const { team, teamLoaded, reloadTeam } = useCurrentTeam();
  const { memberRole, memberLoaded, canManage } = useCurrentTeamMember();
  const teamId = team?.id;

  const {
    teamSummary,
    teamSummaryLoaded,
    teamSummaryError,
    reloadTeamSummary,
  } = useTeamSettingsSummary({
    teamId,
    teamLoaded,
  });

  const {
    teamActionError,
    updateTeamProfile,
    regenerateInviteCode,
    leaveTeam,
    deleteTeam,
  } = useTeamSettingsActions({
    team,
    memberRole,
    canManage,
    reloadTeam,
  });

  return {
    team,
    teamRole: memberRole,
    teamSummary,
    teamSettingsLoaded: teamLoaded && memberLoaded && teamSummaryLoaded,
    teamSummaryError,
    teamActionError,
    canManage,
    updateTeamProfile,
    regenerateInviteCode,
    reloadTeam,
    reloadTeamSummary,
    leaveTeam,
    deleteTeam,
  };
}
