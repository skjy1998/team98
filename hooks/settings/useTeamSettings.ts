import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import type { TeamSettingsSummary, TeamSport } from "@/types/team";
import {
  deleteCurrentTeam,
  getTeamSettingsSummary,
  leaveCurrentTeam,
  regenerateTeamInviteCode,
  updateTeamSettingsProfile,
} from "@/lib/settings/team-settings-repository";

export function useTeamSettings() {
  const { team, teamLoaded, reloadTeam } = useCurrentTeam();
  const { memberRole, memberLoaded, canManage } = useCurrentTeamMember();
  const teamId = team?.id;

  const [teamSummaryError, setTeamSummaryError] = useState("");
  const [teamActionError, setTeamActionError] = useState("");
  const [teamSummary, setTeamSummary] = useState<TeamSettingsSummary | null>(
    null,
  );
  const [teamSummaryLoaded, setTeamSummaryLoaded] = useState(false);

  const loadTeamSummary = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setTeamSummary(null);
      setTeamSummaryLoaded(true);
      setTeamSummaryError("");
      return;
    }

    setTeamSummaryLoaded(false);
    setTeamSummaryError("");

    try {
      const nextSummary = await getTeamSettingsSummary(teamId);
      setTeamSummary(nextSummary);
    } catch (error) {
      console.error("team summary load error", error);
      setTeamSummary(null);
      setTeamSummaryError("팀 현황을 불러오지 못했어요.");
    } finally {
      setTeamSummaryLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTeamSummary();
  }, [loadTeamSummary]);

  const updateTeamProfile = async (name: string, sport: TeamSport) => {
    if (!teamId) {
      setTeamActionError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    const normalizedName = name.trim();

    if (!normalizedName) {
      setTeamActionError("팀명을 입력해 주세요.");
      return false;
    }

    if (!canManage) {
      setTeamActionError("팀 설정을 변경할 권한이 없어요.");
      return false;
    }

    setTeamActionError("");

    try {
      await updateTeamSettingsProfile(teamId, normalizedName, sport);
      await reloadTeam();
      return true;
    } catch (error) {
      console.error("team profile update error", error);
      setTeamActionError("팀 정보 저장에 실패했어요.");
      return false;
    }
  };

  const regenerateInviteCode = async () => {
    if (!teamId) {
      setTeamActionError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole !== "owner") {
      setTeamActionError("회장만 초대 코드를 재발급할 수 있어요.");
      return false;
    }

    setTeamActionError("");

    try {
      await regenerateTeamInviteCode(teamId);
      await reloadTeam();
      return true;
    } catch (error) {
      console.error("invite code regeneration error", error);
      setTeamActionError("초대 코드 재발급에 실패했어요.");
      return false;
    }
  };

  const leaveTeam = async () => {
    if (!teamId) {
      setTeamActionError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole === "owner") {
      setTeamActionError("회장은 팀을 나갈 수 없어요.");
      return false;
    }

    setTeamActionError("");

    try {
      await leaveCurrentTeam(teamId);
      return true;
    } catch (error) {
      console.error("leave team error", error);
      setTeamActionError("팀 나가기에 실패했어요.");
      return false;
    }
  };

  const deleteTeam = async (teamName: string) => {
    if (!teamId || !team) {
      setTeamActionError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole !== "owner") {
      setTeamActionError("회장만 팀을 삭제할 수 있어요.");
      return false;
    }

    const normalizedTeamName = teamName.trim();

    if (normalizedTeamName !== team.name) {
      setTeamActionError("입력한 팀명이 현재 팀명과 일치하지 않아요.");
      return false;
    }

    setTeamActionError("");

    try {
      await deleteCurrentTeam(teamId, normalizedTeamName);
      return true;
    } catch (error) {
      console.error("delete team error", error);
      setTeamActionError("팀 삭제에 실패했어요.");
      return false;
    }
  };

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
    reloadTeamSummary: loadTeamSummary,
    leaveTeam,
    deleteTeam,
  };
}
