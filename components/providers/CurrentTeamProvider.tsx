"use client";
import type { CurrentTeam } from "@/types/team";
import { getCurrentUserTeams } from "@/lib/team/team-repository";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CurrentTeamContextValue {
  teams: CurrentTeam[];
  selectTeam: (teamId: string) => boolean;
  team: CurrentTeam | null;
  teamLoaded: boolean;
  teamError: string;
  reloadTeam: () => Promise<CurrentTeam[]>;
}

const CurrentTeamContext = createContext<CurrentTeamContextValue | null>(null);

interface CurrentTeamProviderProps {
  children: ReactNode;
}

export function CurrentTeamProvider({
  children,
}: Readonly<CurrentTeamProviderProps>) {
  const [teams, setTeams] = useState<CurrentTeam[]>([]);
  const [team, setTeam] = useState<CurrentTeam | null>(null);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [teamError, setTeamError] = useState("");

  const loadCurrentTeam = useCallback(async () => {
    setTeamLoaded(false);
    setTeamError("");

    try {
      const nextTeams = await getCurrentUserTeams();
      const savedTeamId = globalThis.localStorage.getItem(
        "squadflow.activeTeamId",
      );
      const nextTeam =
        nextTeams.find((item) => item.id === savedTeamId) ??
        nextTeams[0] ??
        null;

      setTeams(nextTeams);
      setTeam(nextTeam);

      if (nextTeam) {
        globalThis.localStorage.setItem("squadflow.activeTeamId", nextTeam.id);
      } else {
        globalThis.localStorage.removeItem("squadflow.activeTeamId");
      }

      return nextTeams;
    } catch (error) {
      console.error("current team load error", error);
      setTeams([]);
      setTeam(null);
      setTeamError("팀 정보를 불러오지 못했어요.");
      return [];
    } finally {
      setTeamLoaded(true);
    }
  }, []);

  const selectTeam = useCallback(
    (teamId: string) => {
      const nextTeam = teams.find((item) => item.id === teamId);
      if (!nextTeam) return false;

      globalThis.localStorage.setItem("squadflow.activeTeamId", nextTeam.id);
      setTeam(nextTeam);
      return true;
    },
    [teams],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentTeam();
  }, [loadCurrentTeam]);

  const contextValue = useMemo(
    () => ({
      team,
      teams,
      teamLoaded,
      teamError,
      reloadTeam: loadCurrentTeam,
      selectTeam,
    }),
    [team, teams, teamLoaded, teamError, loadCurrentTeam, selectTeam],
  );

  return (
    <CurrentTeamContext value={contextValue}>{children}</CurrentTeamContext>
  );
}

export function useCurrentTeamContext() {
  const context = useContext(CurrentTeamContext);

  if (!context) {
    throw new Error(
      "useCurrentTeamContext must be used within CurrentTeamProvider",
    );
  }
  return context;
}
