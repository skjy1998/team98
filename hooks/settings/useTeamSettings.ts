import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import type { TeamSettingsSummary, TeamSport } from "@/types/team";
import { supabase } from "@/lib/supabase";

export function useTeamSettings() {
  const { team, teamLoaded, reloadTeam } = useCurrentTeam();
  const { memberRole, memberLoaded, canManage } = useCurrentTeamMember();
  const teamId = team?.id;

  const [teamError, setTeamError] = useState("");
  const [teamSummary, setTeamSummary] = useState<TeamSettingsSummary | null>(
    null,
  );
  const [teamSummaryLoaded, setTeamSummaryLoaded] = useState(false);

  const loadTeamSummary = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setTeamSummary(null);
      setTeamSummaryLoaded(true);
      return;
    }

    setTeamSummaryLoaded(false);

    const [playersResult, accountsResult, unlinkedPlayersResult] =
      await Promise.all([
        supabase
          .from("players")
          .select("id", { count: "exact", head: true })
          .eq("team_id", teamId),

        supabase
          .from("team_members")
          .select("id", { count: "exact", head: true })
          .eq("team_id", teamId),

        supabase
          .from("players")
          .select("id", { count: "exact", head: true })
          .eq("team_id", teamId)
          .is("user_id", null),
      ]);

    const hasError =
      playersResult.error ||
      accountsResult.error ||
      unlinkedPlayersResult.error;

    if (hasError) {
      console.error("team summary load error", {
        playersError: playersResult.error,
        accountsError: accountsResult.error,
        unlinkedPlayersError: unlinkedPlayersResult.error,
      });

      setTeamSummary(null);
      setTeamError("팀 현황을 불러오지 못했어요.");
      setTeamSummaryLoaded(true);
      return;
    }

    setTeamSummary({
      playerCount: playersResult.count ?? 0,
      accountCount: accountsResult.count ?? 0,
      unlinkedPlayerCount: unlinkedPlayersResult.count ?? 0,
    });

    setTeamSummaryLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTeamSummary();
  }, [loadTeamSummary]);

  const updateTeamProfile = async (name: string, sport: TeamSport) => {
    if (!team?.id) {
      setTeamError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    const normalizedName = name.trim();

    if (!normalizedName) {
      setTeamError("팀명을 입력해 주세요.");
      return false;
    }

    if (!canManage) {
      setTeamError("팀 설정을 변경할 권한이 없어요.");
      return false;
    }

    setTeamError("");

    const { error } = await supabase.rpc("update_team_profile", {
      p_team_id: team.id,
      p_name: normalizedName,
      p_sport: sport,
    });

    if (error) {
      console.error("team profile update error", error);
      setTeamError("팀 정보 저장에 실패했어요.");
      return false;
    }

    await reloadTeam();
    return true;
  };

  const regenerateInviteCode = async () => {
    if (!team?.id) {
      setTeamError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole !== "owner") {
      setTeamError("회장만 초대 코드를 재발급할 수 있어요.");
      return false;
    }

    setTeamError("");

    const { error } = await supabase.rpc("regenerate_team_invite_code", {
      p_team_id: team.id,
    });

    if (error) {
      console.error("invite code regeneration error", error);
      setTeamError("초대 코드 재발급에 실패했어요.");
      return false;
    }

    await reloadTeam();
    return true;
  };

  const leaveTeam = async () => {
    if (!teamId) {
      setTeamError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole === "owner") {
      setTeamError("회장은 팀을 나갈 수 없어요.");
      return false;
    }

    setTeamError("");

    const { error } = await supabase.rpc("leave_current_team", {
      p_team_id: teamId,
    });

    if (error) {
      console.error("leave team error", error);
      setTeamError(error.message || "팀 나가기에 실패했어요.");
      return false;
    }

    return true;
  };

  const deleteTeam = async (teamName: string) => {
    if (!teamId || !team) {
      setTeamError("팀 정보를 확인할 수 없어요.");
      return false;
    }

    if (memberRole !== "owner") {
      setTeamError("회장만 팀을 삭제할 수 있어요.");
      return false;
    }

    if (teamName.trim() !== team.name) {
      setTeamError("입력한 팀명이 현재 팀명과 일치하지 않아요.");
      return false;
    }

    setTeamError("");

    const { error } = await supabase.rpc("delete_current_team", {
      p_team_id: teamId,
      p_team_name: teamName.trim(),
    });

    if (error) {
      console.error("delete team error", error);
      setTeamError(error.message || "팀 삭제에 실패했어요.");
      return false;
    }

    return true;
  };

  return {
    team,
    teamRole: memberRole,
    teamSummary,
    teamSettingsLoaded: teamLoaded && memberLoaded && teamSummaryLoaded,
    teamError,
    canManage,
    updateTeamProfile,
    regenerateInviteCode,
    reloadTeam,
    leaveTeam,
    deleteTeam,
  };
}
