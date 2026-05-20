"use client";

import MatchDetailCard from "@/components/matches/MatchDetailCard";
import MatchFormModal from "@/components/matches/MatchFormModal";
import MatchLineupModal from "@/components/matches/MatchLineupModal";
import MatchRecordModal from "@/components/matches/MatchRecordModal";
import MatchScheduleList from "@/components/matches/MatchScheduleList";
import PageHeader from "@/components/PageHeader";

import { useMatches } from "@/hooks/useMatches";
import { usePlayers } from "@/hooks/usePlayers";
import { MatchEvent, MatchLineup, MatchTab, MatchType } from "@/types/match";
import { useState } from "react";

export default function MatchesPage() {
  const { matches, setMatches } = useMatches();

  // 경기 선택
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatch = matches.find((match) => match.id === selectedMatchId);
  // 경기 상세 탭
  const [activeTab, setActiveTab] = useState<MatchTab>("기록");

  // 일정 추가 모달 상태
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // 라인업 저장
  const { players } = usePlayers();
  const [lineupOpen, setLineupOpen] = useState(false);

  // 일정 저장 함수
  const handleAddMatch = (match: MatchType) => {
    setMatches((prev) => [...prev, match]);
    setScheduleOpen(false);
  };

  // 일정 카드 삭제 함수
  const handleDeleteMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((match) => match.id !== matchId));
    if (selectedMatchId === matchId) {
      setSelectedMatchId(null);
    }
  };

  // 기록 추가 모달 상태
  const [recordOpen, setRecordOpen] = useState(false);

  // 기록 저장 함수
  const handleAddRecord = (event: MatchEvent) => {
    if (!selectedMatch) return;

    setMatches((prev) =>
      prev.map((match) =>
        match.id === selectedMatch.id
          ? {
              ...match,
              events: [...match.events, event],
            }
          : match,
      ),
    );

    setRecordOpen(false);
  };

  // 기록 삭제 함수
  const removeRecord = (match: MatchType, eventId: string) => ({
    ...match,
    events: match.events.filter((event) => event.id !== eventId),
  });

  const handleDeleteRecord = (eventId: string) => {
    const selectedId = selectedMatch?.id;
    if (!selectedId) return;

    setMatches((prev) =>
      prev.map((match) =>
        match.id === selectedId ? removeRecord(match, eventId) : match,
      ),
    );
  };

  const handleSaveLineup = (lineup: MatchLineup) => {
    if (!selectedMatch) return;
    setMatches((prev) =>
      prev.map((match) =>
        match.id === selectedMatch.id
          ? {
              ...match,
              lineup,
            }
          : match,
      ),
    );
    setLineupOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="경기 일정"
        description="등록된 경기 일정을 확인하고 관리하세요."
      />

      <div className="grid grid-cols-[250px_1fr] gap-4 2xl:grid-cols-[300px_1fr] 2xl:gap-5">
        {/* 경기 일정표 */}
        <MatchScheduleList
          matches={matches}
          selectedMatchId={selectedMatchId}
          onSelect={setSelectedMatchId}
          onDelete={handleDeleteMatch}
          onAddOpen={() => setScheduleOpen(true)}
        />
        <MatchDetailCard
          match={selectedMatch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordOpen={() => setRecordOpen(true)}
          onRecordDelete={handleDeleteRecord}
          onLineupOpen={() => setLineupOpen(true)}
        />
      </div>
      {/* 일정 추가 모달 */}
      {scheduleOpen && (
        <MatchFormModal
          onClose={() => setScheduleOpen(false)}
          onSave={handleAddMatch}
        />
      )}
      {recordOpen && (
        <MatchRecordModal
          onClose={() => setRecordOpen(false)}
          onSave={handleAddRecord}
        />
      )}
      {lineupOpen && selectedMatch && (
        <MatchLineupModal
          initialLineup={selectedMatch.lineup}
          players={players}
          onClose={() => setLineupOpen(false)}
          onSave={handleSaveLineup}
        />
      )}
    </div>
  );
}
