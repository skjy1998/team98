import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  getCurrentUserSummary,
  signOutCurrentUser,
  type CurrentUserSummary,
} from "@/lib/auth/auth-repository";
import { PlayerRole, TeamMemberRole } from "@/types/player";
import { getCurrentTeamMember } from "@/lib/team/team-member-repository";
import { getCurrentTeamPlayerRole } from "@/lib/players/player-repository";

export function useSidebarData() {
  const { team, teamLoaded, teamError, reloadTeam } = useCurrentTeam();

  const [user, setUser] = useState<CurrentUserSummary | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userError, setUserError] = useState("");
  const [memberRole, setMemberRole] = useState<TeamMemberRole | null>(null);
  const [playerRole, setPlayerRole] = useState<PlayerRole | null>(null);

  const teamId = team?.id;

  const loadUser = useCallback(async () => {
    setUserLoaded(false);
    setUserError("");

    try {
      const nextUser = await getCurrentUserSummary();
      setUser(nextUser);
    } catch (error) {
      console.error("sidebar user load error", error);
      setUser(null);
      setUserError("사용자 정보를 불러오지 못했어요.");
    } finally {
      setUserLoaded(true);
    }
  }, []);

  const loadRoleSummary = useCallback(async () => {
    if (!teamId) {
      setMemberRole(null);
      setPlayerRole(null);
      return;
    }

    try {
      const [member, nextPlayerRole] = await Promise.all([
        getCurrentTeamMember(teamId),
        getCurrentTeamPlayerRole(teamId),
      ]);

      setMemberRole(member?.role ?? null);
      setPlayerRole(nextPlayerRole);
    } catch (error) {
      console.error("sidebar role summary load error", error);
      setMemberRole(null);
      setPlayerRole(null);
    }
  }, [teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUser();
  }, [loadUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRoleSummary();
  }, [loadRoleSummary]);

  const logout = async () => {
    try {
      await signOutCurrentUser();
      return true;
    } catch (error) {
      console.error("logout error", error);
      return false;
    }
  };

  const reloadSidebarData = async () => {
    await Promise.all([reloadTeam(), loadUser(), loadRoleSummary()]);
  };

  return {
    user,
    team,
    memberRole,
    playerRole,
    sidebarLoaded: teamLoaded && userLoaded,
    sidebarError: teamError || userError,
    logout,
    reloadSidebarData,
  };
}
