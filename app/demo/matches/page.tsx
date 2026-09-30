"use client";

import PageHeader from "@/components/PageHeader";
import SeasonSelect from "@/components/common/SeasonSelect";
import { useDemoData } from "@/components/demo/DemoModeProvider";
import MatchesCalendar from "@/components/matches/calendar/MatchesCalendar";
import MatchSection from "@/components/matches/list/MatchSection";
import MatchViewToggle from "@/components/matches/list/MatchViewToggle";
import MatchCreateModal from "@/components/matches/list/create/MatchCreateModal";
import { demoSeasons } from "@/lib/demo/demo-matches-data";
import { getMatchListData } from "@/lib/matches/match-list-ui";
import type { MatchCreateFormValue, MatchScheduleView } from "@/types/match";
import { useState } from "react";

export default function DemoMatchesPage() {
  const { matches, addMatch, matchRecords } = useDemoData();
  const [selectedSeasonId, setSelectedSeasonId] = useState(demoSeasons[0].id);
  const [scheduleView, setScheduleView] = useState<MatchScheduleView>("list");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const selectedSeason = demoSeasons.find(
    (season) => season.id === selectedSeasonId,
  );

  const seasonMatches = matches.filter(
    (match) => match.seasonId === selectedSeasonId,
  );

  const { displayMatches, upcomingMatches, pastMatches } = getMatchListData(
    seasonMatches,
    matchRecords,
  );

  const handleCreate = async (value: MatchCreateFormValue) => {
    const success = await addMatch(value, selectedSeasonId);

    if (success) {
      setIsCreateOpen(false);
    }

    return success;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 md:w-auto"
        >
          + 일정 등록
        </button>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-sky-700 sm:px-4 sm:py-3">
        데모에서 등록한 일정은 이 브라우저에서만 유지되며, 새로고침하면
        초기화됩니다.
      </div>

      <div className="flex items-center justify-between gap-3">
        <SeasonSelect
          seasons={demoSeasons}
          selectedSeasonId={selectedSeason?.id}
          ariaLabel="조회할 시즌 선택"
          onChange={setSelectedSeasonId}
        />

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-stone-500 sm:text-sm">
            총 {displayMatches.length}경기
          </span>
          <MatchViewToggle value={scheduleView} onChange={setScheduleView} />
        </div>
      </div>

      {scheduleView === "calendar" ? (
        <MatchesCalendar matches={displayMatches} />
      ) : (
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      )}

      {isCreateOpen && (
        <MatchCreateModal
          defaultSport="soccer"
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}
