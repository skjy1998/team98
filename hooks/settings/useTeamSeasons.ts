import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import {
  activateTeamSeason,
  createTeamSeason,
  deleteTeamSeason,
  getTeamSeasons,
  updateTeamSeason,
} from "@/lib/settings/team-season-repository";

export function useTeamSeasons() {
  const { team, teamLoaded } = useCurrentTeam();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();

  const teamId = team?.id;
  const currentUserId = member?.userId;

  const [seasons, setSeasons] = useState<TeamSeason[]>([]);
  const [seasonsLoaded, setSeasonsLoaded] = useState(false);
  const [seasonsError, setSeasonsError] = useState("");

  const loadSeasons = useCallback(async () => {
    if (!teamLoaded || !memberLoaded) return;

    if (!teamId) {
      setSeasons([]);
      setSeasonsLoaded(true);
      setSeasonsError("");
      return;
    }

    setSeasonsLoaded(false);
    setSeasonsError("");

    try {
      const nextSeasons = await getTeamSeasons(teamId);
      setSeasons(nextSeasons);
    } catch (error) {
      console.error("team seasons load error", error);
      setSeasons([]);
      setSeasonsError("시즌 정보를 불러오지 못했어요.");
    } finally {
      setSeasonsLoaded(true);
    }
  }, [teamLoaded, memberLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSeasons();
  }, [loadSeasons]);

  const createSeason = async (value: TeamSeasonFormValue) => {
    if (!teamId || !currentUserId || !canManage) return false;

    try {
      await createTeamSeason(teamId, currentUserId, value);
      await loadSeasons();
      return true;
    } catch (error) {
      console.error("team season create error", error);
      return false;
    }
  };

  const updateSeason = async (seasonId: string, value: TeamSeasonFormValue) => {
    if (!teamId || !canManage) return false;

    try {
      const updated = await updateTeamSeason(teamId, seasonId, value);

      if (!updated) return false;

      await loadSeasons();
      return true;
    } catch (error) {
      console.error("team season update error", error);
      return false;
    }
  };

  const setActiveSeason = async (seasonId: string) => {
    if (!teamId || !canManage) return false;

    try {
      await activateTeamSeason(teamId, seasonId);
      await loadSeasons();
      return true;
    } catch (error) {
      console.error("active team season update error", error);
      return false;
    }
  };

  const deleteSeason = async (seasonId: string) => {
    if (!teamId || !canManage) return false;

    const season = seasons.find((item) => item.id === seasonId);

    if (!season || season.isActive) return false;

    try {
      const deleted = await deleteTeamSeason(teamId, seasonId);

      if (!deleted) return false;

      setSeasons((current) => current.filter((item) => item.id !== seasonId));

      return true;
    } catch (error) {
      console.error("team season delete error", error);
      return false;
    }
  };

  return {
    seasons,
    activeSeason: seasons.find((season) => season.isActive),
    seasonsLoaded,
    seasonsError,
    canManage,
    createSeason,
    updateSeason,
    setActiveSeason,
    deleteSeason,
    reloadSeasons: loadSeasons,
  };
}
