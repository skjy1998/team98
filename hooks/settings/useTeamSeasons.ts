import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface TeamSeasonRow {
  id: string;
  team_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SEASON_COLUMNS = `
  id,
  team_id,
  name,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
`;

function mapSeason(row: TeamSeasonRow): TeamSeason {
  return {
    id: row.id,
    teamId: row.team_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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
      return;
    }

    setSeasonsLoaded(false);
    setSeasonsError("");

    const { data, error } = await supabase
      .from("team_seasons")
      .select(SEASON_COLUMNS)
      .eq("team_id", teamId)
      .order("is_active", { ascending: false })
      .order("start_date", { ascending: false });

    if (error || !data) {
      console.error("team seasons load error", error);
      setSeasons([]);
      setSeasonsError("시즌 정보를 불러오지 못헀어요.");
      setSeasonsLoaded(true);
      return;
    }

    setSeasons((data as TeamSeasonRow[]).map((row) => mapSeason(row)));
    setSeasonsLoaded(true);
  }, [teamLoaded, memberLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSeasons();
  }, [loadSeasons]);

  const createSeason = async (value: TeamSeasonFormValue) => {
    if (!teamId || !currentUserId || !canManage) return false;

    const { error } = await supabase.from("team_seasons").insert({
      team_id: teamId,
      name: value.name.trim(),
      start_date: value.startDate,
      end_date: value.endDate || null,
      is_active: false,
      created_by: currentUserId,
    });

    if (error) {
      console.error("team season create error", error);
      return false;
    }

    await loadSeasons();
    return true;
  };

  const updateSeason = async (seasonId: string, value: TeamSeasonFormValue) => {
    if (!teamId || !canManage) return false;

    const { error } = await supabase
      .from("team_seasons")
      .update({
        name: value.name.trim(),
        start_date: value.startDate,
        end_date: value.endDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", seasonId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team season update error", error);
      return false;
    }

    await loadSeasons();
    return true;
  };

  const setActiveSeason = async (seasonId: string) => {
    if (!teamId || !canManage) return false;

    const { error } = await supabase.rpc("set_active_team_season", {
      target_team_id: teamId,
      target_season_id: seasonId,
    });

    if (error) {
      console.error("active team season update error", error);
      return false;
    }

    await loadSeasons();
    return true;
  };

  const deleteSeason = async (seasonId: string) => {
    if (!teamId || !canManage) return false;

    const season = seasons.find((item) => item.id === seasonId);

    if (!season || season.isActive) return false;

    const { error } = await supabase
      .from("team_seasons")
      .delete()
      .eq("id", seasonId)
      .eq("team_id", teamId);

    if (error) {
      console.error("team season delete error", error);
      return false;
    }

    setSeasons((current) => current.filter((item) => item.id !== seasonId));

    return true;
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
