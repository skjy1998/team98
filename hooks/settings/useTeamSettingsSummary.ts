import { getTeamSettingsSummary } from "@/lib/settings/team-settings-repository";
import type { TeamSettingsSummary } from "@/types/team";
import { useCallback, useEffect, useState } from "react";

interface UseTeamSettingsSummaryParams {
  teamId?: string;
  teamLoaded: boolean;
}

export function useTeamSettingsSummary({
  teamId,
  teamLoaded,
}: Readonly<UseTeamSettingsSummaryParams>) {
  const [teamSummary, setTeamSummary] = useState<TeamSettingsSummary | null>(
    null,
  );
  const [teamSummaryLoaded, setTeamSummaryLoaded] = useState(false);
  const [teamSummaryError, setTeamSummaryError] = useState("");

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
  }, [teamId, teamLoaded]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTeamSummary();
  }, [loadTeamSummary]);

  return {
    teamSummary,
    teamSummaryLoaded,
    teamSummaryError,
    reloadTeamSummary: loadTeamSummary,
  };
}
