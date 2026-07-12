import { usePlayers } from "@/hooks/players/usePlayers";
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
  getAttendPlayerIdsByVotes,
  getAttendPlayers,
  getGroupedMatchRecordEvents,
  quarterSections,
} from "@/lib/match-record";
import type { EditingRecordForm } from "@/lib/match-record";
import MatchRecordQuarterSection from "./MatchRecordQuarterSection";
import { DragEndEvent } from "@dnd-kit/core";

interface MatchRecordTabProps {
  matchId: string;
  events: MatchRecordEvent[];
  recordsLoaded: boolean;
  addEvent: (type: MatchRecordEventType) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  updateEvent: (
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => Promise<boolean>;
  reorderEvents: (activeId: string, overId: string) => Promise<boolean>;
  canManage: boolean;
}

export default function MatchRecordTab({
  matchId,
  events,
  recordsLoaded,
  addEvent,
  deleteEvent,
  updateEvent,
  reorderEvents,
  canManage,
}: Readonly<MatchRecordTabProps>) {
  const { players, playersLoaded } = usePlayers();
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

  // 수정 시작 함수
  const handleStartEdit = (event: MatchRecordEvent) => {
    if (!canManage) return;

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

  const handleAddEvent = async (type: MatchRecordEventType) => {
    if (!canManage) return;

    const success = await addEvent(type);

    if (!success) {
      globalThis.alert("기록 추가에 실패했어요.");
    }
  };

  // 선수 기록 삭제 함수
  const handleDeleteRecord = async (event: MatchRecordEvent) => {
    if (!canManage) return;

    const confirmed = globalThis.confirm("이 기록을 삭제할까요?");
    if (!confirmed) return;

    if (editingForm.eventId === event.id) {
      handleCancelEdit();
    }

    const success = await deleteEvent(event.id);

    if (!success) {
      globalThis.alert("기록 삭제에 실패했어요.");
    }
  };

  /// 수정 완료 함수
  const handleSubmitEdit = async () => {
    if (!canManage) return;
    if (!editingForm.eventId) return;

    const selectPlayer = players.find(
      (player) => player.id === editingForm.playerId,
    );
    const selectedAssistPlayer = players.find(
      (player) => player.id === editingForm.assistPlayerId,
    );

    const success = await updateEvent(editingForm.eventId, {
      playerId: editingForm.playerId,
      playerName: selectPlayer?.name ?? "",
      assistPlayerId: editingForm.assistPlayerId,
      assistPlayerName: selectedAssistPlayer?.name ?? "",
      quarter: editingForm.quarter,
      minute: editingForm.minute,
    });

    if (!success) {
      globalThis.alert("기록 수정에 실패했어요.");
      return;
    }

    handleCancelEdit();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!canManage) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const success = await reorderEvents(String(active.id), String(over.id));

    if (!success) {
      globalThis.alert("기록 순서 변경에 실패했어요.");
    }
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

  if (!playersLoaded || !recordsLoaded || !votesLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">기록 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {canManage && <MatchRecordScoreActions onAddEvent={handleAddEvent} />}
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          경기 기록은 운영진만 수정할 수 있어요.
        </div>
      )}
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
                  canManage={canManage}
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
