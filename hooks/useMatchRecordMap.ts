import { MatchRecordMap } from "@/types/match";
import { useEffect, useState } from "react";

export default function useMatchRecordsMap() {
  const [records, setRecords] = useState<MatchRecordMap>({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem("match-records");

    if (savedRecords && savedRecords !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(JSON.parse(savedRecords));
      } catch {
        localStorage.removeItem("match-records");
      }
    }
    setRecordsLoaded(true);
  }, []);

  return { records, setRecords, recordsLoaded };
}
