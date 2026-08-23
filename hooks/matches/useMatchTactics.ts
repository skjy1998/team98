import {
  createDefaultMatchTactics,
  getMatchFormationOptions,
} from "@/lib/tactics/tactics-ui";
import type {
  FormationName,
  FormationSlot,
  MatchQuarter,
  MatchTacticsByQuarter,
} from "@/types/tactics";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";
import type { TeamSport } from "@/types/team";
import type { MatchPlayersPerSide } from "@/types/match";
import { createQuarterOptions } from "@/lib/matches/match-quarter";

type MatchTacticsRow = {
  match_id: string;
  quarter: MatchQuarter;
  formation: FormationName;
  slots: FormationSlot[];
  corner_kick_player_id: string | null;
  free_kick_player_id: string | null;
  penalty_kick_player_id: string | null;
};

function mapRowsToTactics(
  rows: MatchTacticsRow[],
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
  quarterCount: number,
): MatchTacticsByQuarter {
  const defaultTactics = createDefaultMatchTactics(
    sport,
    playersPerSide,
    quarterCount,
  );
  const validQuarters = new Set(createQuarterOptions(quarterCount));
  const validFormations = new Set(
    getMatchFormationOptions(sport, playersPerSide),
  );

  rows.forEach((row) => {
    if (!validQuarters.has(row.quarter)) return;
    if (!validFormations.has(row.formation)) return;

    defaultTactics[row.quarter] = {
      formation: row.formation,
      slots: row.slots,
      cornerKickPlayerId: row.corner_kick_player_id ?? "",
      freeKickPlayerId: row.free_kick_player_id ?? "",
      penaltyKickPlayerId: row.penalty_kick_player_id ?? "",
    };
  });

  return defaultTactics;
}

export function useMatchTactics(
  matchId: string,
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
  quarterCount: number,
) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;
  const [tacticsByQuarter, setTacticsByQuarter] =
    useState<MatchTacticsByQuarter>(() =>
      createDefaultMatchTactics(sport, playersPerSide, quarterCount),
    );
  const [tacticsLoaded, setTacticsLoaded] = useState(false);

  const loadMatchTactics = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId || !matchId) {
      setTacticsByQuarter(createDefaultMatchTactics(sport, playersPerSide));
      setTacticsLoaded(true);
      return;
    }

    setTacticsLoaded(false);

    const { data, error } = await supabase
      .from("match_tactics")
      .select(
        "match_id, quarter, formation, slots, corner_kick_player_id, free_kick_player_id, penalty_kick_player_id",
      )
      .eq("team_id", teamId)
      .eq("match_id", matchId);

    if (error || !data) {
      setTacticsByQuarter(createDefaultMatchTactics(sport, playersPerSide));
      setTacticsLoaded(true);
      return;
    }

    setTacticsByQuarter(
      mapRowsToTactics(
        data as MatchTacticsRow[],
        sport,
        playersPerSide,
        quarterCount,
      ),
    );
    setTacticsLoaded(true);
  }, [teamLoaded, teamId, matchId, sport, playersPerSide, quarterCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatchTactics();
  }, [loadMatchTactics]);

  const saveTacticsByQuarter = async (
    updater:
      | MatchTacticsByQuarter
      | ((prev: MatchTacticsByQuarter) => MatchTacticsByQuarter),
  ) => {
    if (!teamId || !matchId) return false;

    const nextTactics =
      typeof updater === "function" ? updater(tacticsByQuarter) : updater;

    setTacticsByQuarter(nextTactics);

    const rows = (
      Object.entries(nextTactics) as [
        MatchQuarter,
        MatchTacticsByQuarter[MatchQuarter],
      ][]
    ).map(([quarter, tactics]) => ({
      team_id: teamId,
      match_id: matchId,
      quarter,
      formation: tactics.formation,
      slots: tactics.slots,
      corner_kick_player_id: tactics.cornerKickPlayerId || null,
      free_kick_player_id: tactics.freeKickPlayerId || null,
      penalty_kick_player_id: tactics.penaltyKickPlayerId || null,
    }));

    const { error } = await supabase
      .from("match_tactics")
      .upsert(rows, { onConflict: "match_id,quarter" });

    if (error) {
      console.error(
        "match tactics save error:",
        JSON.stringify({
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        }),
      );
      await loadMatchTactics();
      return false;
    }

    return true;
  };

  return {
    tacticsByQuarter,
    saveTacticsByQuarter,
    tacticsLoaded,
    reloadMatchTactics: loadMatchTactics,
  };
}
