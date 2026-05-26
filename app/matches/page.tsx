"use client";

import PageHeader from "@/components/PageHeader";
import { initialMatches } from "@/data/initialMatches";
import MatchSection from "@/components/matches/MatchSection";
import { useEffect, useMemo, useState } from "react";

type MatchRecordEvent = {
  id: string;
  type: "goal" | "concede";
  playerId?: string;
  playerName?: string;
  minute?: string;
};

type MatchRecordMap = Record<string, MatchRecordEvent[]>;

export default function MatchesPage() {
  const [records, setRecords] = useState<MatchRecordMap>({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("match-records");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecords(JSON.parse(saved));
    }

    setRecordsLoaded(true);
  }, []);

  const displayMatches = useMemo(() => {
    return initialMatches.map((match) => {
      const events = records[match.id] ?? [];

      if (events.length === 0) {
        return match;
      }

      const ourScore = events.filter((event) => event.type === "goal").length;
      const opponentScore = events.filter(
        (event) => event.type === "concede",
      ).length;

      return {
        ...match,
        ourScore,
        opponentScore,
      };
    });
  }, [records]);

  const upcomingMatches = displayMatches.filter((match) => match.isUpcoming);
  const pastMatches = displayMatches.filter((match) => !match.isUpcoming);

  return (
    <div className="space-y-6">
      <PageHeader
        title="경기 일정"
        description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
      />

      <div className="rounded-[28px] border border-stone-200 bg-white p-4 md:p-6">
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      </div>
    </div>
  );
}
