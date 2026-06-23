import { usePlayers } from "@/hooks/usePlayers";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordQuarter,
} from "@/types/match";

import { useMemo, useState } from "react";

import MatchRecordScoreActions from "./MatchRecordScoreActions";

import { useMatchVotes } from "@/hooks/useMatchVotes";
import {
  defaultEditingRecordForm,
  EditingRecordForm,
  getAttendPlayerIdsByVotes,
  getAttendPlayers,
  getGroupedMatchRecordEvents,
  getPlayersAfterRecordDelete,
  getPlayersAfterRecordEdit,
  quarterSections,
} from "@/lib/match-record";
import MatchRecordQuarterSection from "./MatchRecordQuarterSection";
import { DragEndEvent } from "@dnd-kit/core";

interface MatchRecordTabProps {
  matchId: string;
  events: MatchRecordEvent[];
  recordsLoaded: boolean;
  addEvent: (type: MatchRecordEventType) => void;
  deleteEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<MatchRecordEvent>) => void;
  reorderEvents: (activeId: string, overId: string) => void;
}

export default function MatchRecordTab({
  matchId,
  events,
  recordsLoaded,
  addEvent,
  deleteEvent,
  updateEvent,
  reorderEvents,
}: Readonly<MatchRecordTabProps>) {
  const { players, setPlayers, playersLoaded } = usePlayers();
  const { votes, votesLoaded } = useMatchVotes();
  const [editingForm, setEditingForm] = useState<EditingRecordForm>(
    defaultEditingRecordForm,
  );

  const groupedEvents = useMemo(
    () => getGroupedMatchRecordEvents(events),
    [events],
  );

  // 현재 경기 참석자 id 만들기
  const attendPlayerIds = useMemo(
    () => getAttendPlayerIdsByVotes(votes, matchId),
    [votes, matchId],
  );

  // 참석자 기준 뱃지 목록
  const attendPlayers = useMemo(
    () => getAttendPlayers(players, attendPlayerIds),
    [players, attendPlayerIds],
  );

  if (!playersLoaded || !recordsLoaded || !votesLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">기록 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 수정 시작 함수
  const handleStartEdit = (event: MatchRecordEvent) => {
    setEditingForm({
      eventId: event.id,
      playerId: event.playerId ?? "",
      assistPlayerId: event.assistPlayerId ?? "",
      quarter: event.quarter ?? "unknown",
      minute: event.minute ?? "",
    });
  };

  // 수정 취소 함수
  const handleCancelEdit = () => {
    setEditingForm(defaultEditingRecordForm);
  };

  // 선수 기록 삭제 함수
  const handleDeleteRecord = (event: MatchRecordEvent) => {
    const confirmed = globalThis.confirm("이 기록을 삭제할까요?");
    if (!confirmed) return;
    setPlayers((prevPlayers) =>
      getPlayersAfterRecordDelete(prevPlayers, event),
    );

    if (editingForm.eventId === event.id) {
      handleCancelEdit();
    }

    deleteEvent(event.id);
  };

  /// 수정 완료 함수
  const handleSubmitEdit = () => {
    if (!editingForm.eventId) return;

    const currentEvent = events.find(
      (event) => event.id === editingForm.eventId,
    );
    if (!currentEvent) return;

    const selectPlayer = players.find(
      (player) => player.id === editingForm.eventId,
    );
    const selectedAssistPlayer = players.find(
      (player) => player.id === editingForm.eventId,
    );

    setPlayers((prevPlayers) =>
      getPlayersAfterRecordEdit(prevPlayers, currentEvent, {
        playerId: editingForm.playerId,
        assistPlayerId: editingForm.assistPlayerId,
      }),
    );

    updateEvent(editingForm.eventId, {
      playerId: editingForm.playerId,
      playerName: selectPlayer?.name ?? "",
      assistPlayerId: editingForm.assistPlayerId,
      assistPlayerName: selectedAssistPlayer?.name ?? "",
      quarter: editingForm.quarter,
      minute: editingForm.minute,
    });

    handleCancelEdit();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderEvents(String(active.id), String(over.id));
  };

  const handleChangeEditingPlayerId = (value: string) => {
    setEditingForm((prev) => ({
      ...prev,
      playerId: value,
    }));
  };

  const handleChangeEditingAssistPlayerId = (value: string) => {
    setEditingForm((prev) => ({
      ...prev,
      assistPlayerId: value,
    }));
  };

  const handleChangeEditingQuarter = (value: MatchRecordQuarter) => {
    setEditingForm((prev) => ({
      ...prev,
      quarter: value,
    }));
  };

  const handleChangeEditingMinute = (value: string) => {
    setEditingForm((prev) => ({
      ...prev,
      minute: value,
    }));
  };

  return (
    <div className="space-y-5">
      <MatchRecordScoreActions onAddEvent={addEvent} />

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">골 기록 추가</h2>
          <p className="text-sm text-stone-400">{events.length}개 기록</p>
        </div>

        <div className="mt-5 space-y-3">
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
              <p className="text-sm text-stone-500">
                아직 추가된 경기 기록이 없어요.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {quarterSections.map((section) => (
                <MatchRecordQuarterSection
                  key={section.key}
                  section={section}
                  quarterEvents={groupedEvents[section.key]}
                  editingForm={editingForm}
                  attendPlayers={attendPlayers}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onDeleteRecord={handleDeleteRecord}
                  onSubmitEdit={handleSubmitEdit}
                  onDragEnd={handleDragEnd}
                  onChangePlayerId={handleChangeEditingPlayerId}
                  onChangeAssistPlayerId={handleChangeEditingAssistPlayerId}
                  onChangeQuarter={handleChangeEditingQuarter}
                  onChangeMinute={handleChangeEditingMinute}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
