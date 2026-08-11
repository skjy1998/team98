import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";

interface MyUnpaidFineSummary {
  count: number;
  totalAmount: number;
}

interface UseMyUnpaidFineSummaryParams {
  playerId?: string;
  enabled: boolean;
}

const emptySummary: MyUnpaidFineSummary = {
  count: 0,
  totalAmount: 0,
};

export function useMyUnpaidFineSummary({
  playerId,
  enabled,
}: UseMyUnpaidFineSummaryParams) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [summary, setSummary] = useState<MyUnpaidFineSummary>(emptySummary);
  const [summaryLoaded, setSummaryLoaded] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!teamLoaded) return;

    if (!enabled || !teamId || !playerId) {
      setSummary(emptySummary);
      setSummaryLoaded(true);
      return;
    }

    setSummaryLoaded(false);

    const { data, error } = await supabase
      .from("finance_fine_charges")
      .select("amount")
      .eq("team_id", teamId)
      .eq("player_id", playerId)
      .eq("status", "unpaid");

    if (error) {
      console.error("my unpaid fine summary load error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      setSummary(emptySummary);
      setSummaryLoaded(true);
      return;
    }

    setSummary({
      count: data.length,
      totalAmount: data.reduce((total, charge) => total + charge.amount, 0),
    });
    setSummaryLoaded(true);
  }, [teamLoaded, teamId, playerId, enabled]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    summaryLoaded,
    reloadSummary: loadSummary,
  };
}
