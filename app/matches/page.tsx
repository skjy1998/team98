"use client";

import PageHeader from "@/components/PageHeader";
import MatchSection from "@/components/matches/MatchSection";
import { useEffect, useMemo, useState } from "react";
import MatchCreateModal from "@/components/matches/MatchCreateModal";
import { MatchCreateFormValue, MatchItem, MatchRecordMap } from "@/types/match";
import { useMatches } from "@/hooks/useMatches";
import { getIsUpcomingMatch } from "@/lib/match-ui";

export default function MatchesPage() {
  const [records, setRecords] = useState<MatchRecordMap>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { matches, setMatches, matchesLoaded } = useMatches();

  useEffect(() => {
    const savedRecords = localStorage.getItem("match-records");

    if (savedRecords) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const displayMatches = useMemo(() => {
    return matches.map((match) => {
      const events = records[match.id] ?? [];
      const isUpcoming = getIsUpcomingMatch(match.date);

      if (events.length === 0) {
        return {
          ...match,
          isUpcoming,
        };
      }

      const ourScore = events.filter((event) => event.type === "goal").length;
      const opponentScore = events.filter(
        (event) => event.type === "concede",
      ).length;

      return {
        ...match,
        ourScore,
        opponentScore,
        isUpcoming,
      };
    });
  }, [matches, records]);

  const upcomingMatches = displayMatches.filter((match) =>
    getIsUpcomingMatch(match.date),
  );
  const pastMatches = displayMatches.filter(
    (match) => !getIsUpcomingMatch(match.date),
  );

  const handleCreateMatch = (value: MatchCreateFormValue) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchDate = new Date(value.date);
    matchDate.setHours(0, 0, 0, 0);

    const isUpcoming = matchDate >= today;

    const newMatch: MatchItem = {
      id: crypto.randomUUID(),
      title: value.title,
      type: value.type,
      date: value.date,
      startTime: value.startTime,
      endTime: value.endTime,
      location: value.location,
      opponent: value.opponent,
      status: "scheduled",
      isUpcoming,
    };
    setMatches((prev) => [newMatch, ...prev]);
    setIsCreateOpen(false);
  };

  if (!matchesLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-sm text-stone-500">경기 일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="경기 일정"
        description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
      />
      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        일정 등록
      </button>
      {upcomingMatches.length === 0 && pastMatches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-10 text-center">
          <p className="text-lg font-semibold text-stone-900">
            등록된 경기 일정이 없어요.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            일정 등록 버튼으로 첫 경기를 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      )}
      {isCreateOpen && (
        <MatchCreateModal
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreateMatch}
        />
      )}
    </div>
  );
}
