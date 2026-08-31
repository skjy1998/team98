"use client";
import type { CurrentTeam } from "@/types/team";
import { getCurrentUserTeam } from "@/lib/team/team-repository";
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
  team: CurrentTeam | null;
  teamLoaded: boolean;
  teamError: string;
  reloadTeam: () => Promise<void>;
}

const CurrentTeamContext = createContext<CurrentTeamContextValue | null>(null);

interface CurrentTeamProviderProps {
  children: ReactNode;
}

export function CurrentTeamProvider({
  children,
}: Readonly<CurrentTeamProviderProps>) {
  const [team, setTeam] = useState<CurrentTeam | null>(null);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [teamError, setTeamError] = useState("");

  const loadCurrentTeam = useCallback(async () => {
    setTeamLoaded(false);
    setTeamError("");

    try {
      const nextTeam = await getCurrentUserTeam();
      setTeam(nextTeam);
    } catch (error) {
      console.error("current team load error", error);
      setTeam(null);
      setTeamError("팀 정보를 불러오지 못했어요.");
    } finally {
      setTeamLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentTeam();
  }, [loadCurrentTeam]);

  const contextValue = useMemo(
    () => ({
      team,
      teamLoaded,
      teamError,
      reloadTeam: loadCurrentTeam,
    }),
    [team, teamLoaded, teamError, loadCurrentTeam],
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
