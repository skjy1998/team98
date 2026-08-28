import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { getPlayerUnpaidFineSummary } from "@/lib/finance/finance-fine-charge-repository";

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
  const [summaryError, setSummaryError] = useState("");

  const loadSummary = useCallback(async () => {
    if (!teamLoaded) return;

    if (!enabled || !teamId || !playerId) {
      setSummary(emptySummary);
      setSummaryLoaded(true);
      setSummaryError("");
      return;
    }

    setSummaryLoaded(false);
    setSummaryError("");

    try {
      const nextSummary = await getPlayerUnpaidFineSummary(teamId, playerId);

      setSummary(nextSummary);
    } catch (error) {
      console.error("my unpaid fine summary load error", error);
      setSummary(emptySummary);
      setSummaryError("미납 벌금 정보를 불러오지 못했어요.");
    } finally {
      setSummaryLoaded(true);
    }
  }, [teamLoaded, teamId, playerId, enabled]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    summaryLoaded,
    summaryError,
    reloadSummary: loadSummary,
  };
}
