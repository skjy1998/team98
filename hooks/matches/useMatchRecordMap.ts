import type { MatchRecordMap } from "@/types/match";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { getTeamMatchRecordMap } from "@/lib/matches/match-record-repository";

export default function useMatchRecordsMap() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [records, setRecords] = useState<MatchRecordMap>({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  const loadRecords = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setRecords({});
      setRecordsLoaded(true);
      setRecordsError("");
      return;
    }

    setRecordsLoaded(false);
    setRecordsError("");

    try {
      const nextRecords = await getTeamMatchRecordMap(teamId);
      setRecords(nextRecords);
    } catch (error) {
      console.error("match record map load error", error);
      setRecords({});
      setRecordsError("경기 기록을 불러오지 못했어요.");
    } finally {
      setRecordsLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords();
  }, [loadRecords]);

  return { records, recordsLoaded, recordsError, reloadRecords: loadRecords };
}
