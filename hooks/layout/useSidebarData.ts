import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  getCurrentUserSummary,
  signOutCurrentUser,
  type CurrentUserSummary,
} from "@/lib/auth/auth-repository";

export function useSidebarData() {
  const { team, teamLoaded, teamError, reloadTeam } = useCurrentTeam();

  const [user, setUser] = useState<CurrentUserSummary | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userError, setUserError] = useState("");

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUser();
  }, [loadUser]);

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
    await Promise.all([reloadTeam(), loadUser()]);
  };

  return {
    user,
    team,
    sidebarLoaded: teamLoaded && userLoaded,
    sidebarError: teamError || userError,
    logout,
    reloadSidebarData,
  };
}
