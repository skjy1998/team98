import { usePlayers } from "@/hooks/usePlayers";
import {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordQuarter,
} from "@/types/match";
import { MatchVotesByMatchId } from "@/types/match-vote";
import { useEffect, useMemo, useState } from "react";
import MatchRecordEditPanel from "./MatchRecordEditPanel";
import MatchRecordCard from "./MatchRecordCard";
import MatchRecordScoreActions from "./MatchRecordScoreActions";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const quarterSections: {
  key: "1Q" | "2Q" | "3Q" | "4Q" | "unknown";
  label: string;
}[] = [
  { key: "1Q", label: "1Q" },
  { key: "2Q", label: "2Q" },
  { key: "3Q", label: "3Q" },
  { key: "4Q", label: "4Q" },
  { key: "unknown", label: "쿼터 모름" },
];

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
  const { players, setPlayers, loaded } = usePlayers();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState("");
  const [editingAssistPlayerId, setEditingAssistPlayerId] = useState("");
  const [editingQuarter, setEditingQuarter] =
    useState<MatchRecordQuarter>("unknown");
  const [editingMinute, setEditingMinute] = useState("");

  const [votes, setVotes] = useState<MatchVotesByMatchId>({});

  useEffect(() => {
    const savedVotes = localStorage.getItem("match-votes");

    if (savedVotes && savedVotes !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVotes(JSON.parse(savedVotes));
      } catch {
        localStorage.removeItem("match-votes");
      }
    }
  }, []);

  const groupedEvents = useMemo(() => {
    return {
      "1Q": events.filter((event) => event.quarter === "1Q"),
      "2Q": events.filter((event) => event.quarter === "2Q"),
      "3Q": events.filter((event) => event.quarter === "3Q"),
      "4Q": events.filter((event) => event.quarter === "4Q"),
      unknown: events.filter(
        (event) => !event.quarter || event.quarter === "unknown",
      ),
    };
  }, [events]);

  // 현재 경기 참석자 id 만들기
  const attendPlayerIds = useMemo(() => {
    const currentVotes = votes[matchId] ?? [];

    return new Set(
      currentVotes
        .filter((vote) => vote.status === "attend")
        .map((vote) => vote.playerId),
    );
  }, [votes, matchId]);

  // 참석자 기준 뱃지 목록
  const attendPlayers = useMemo(() => {
    return players.filter((player) => attendPlayerIds.has(player.id));
  }, [players, attendPlayerIds]);

  if (!loaded || !recordsLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">기록 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 수정 시작 함수
  const handleStartEdit = (event: MatchRecordEvent) => {
    setEditingEventId(event.id);
    setEditingPlayerId(event.playerId ?? "");
    setEditingAssistPlayerId(event.assistPlayerId ?? "");
    setEditingQuarter(event.quarter ?? "unknown");
    setEditingMinute(event.minute ?? "");
  };

  // 수정 취소 함수
  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEditingPlayerId("");
    setEditingAssistPlayerId("");
    setEditingQuarter("unknown");
    setEditingMinute("");
  };

  // 선수 기록 갱신 함수 추가
  const updatePlayerStatsForRecordEdit = (
    prevEvent: MatchRecordEvent,
    nextEvent: {
      playerId: string;
      assistPlayerId: string;
    },
  ) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        let nextGoal = player.goal;
        let nextAssist = player.assist;

        if (prevEvent.type === "goal" && prevEvent.playerId === player.id) {
          nextGoal -= 1;
        }

        if (
          prevEvent.type === "goal" &&
          prevEvent.assistPlayerId &&
          prevEvent.assistPlayerId === player.id
        ) {
          nextAssist -= 1;
        }

        if (prevEvent.type === "goal" && nextEvent.playerId === player.id) {
          nextGoal += 1;
        }

        if (
          prevEvent.type === "goal" &&
          nextEvent.assistPlayerId &&
          nextEvent.assistPlayerId === player.id
        ) {
          nextAssist += 1;
        }

        return {
          ...player,
          goal: Math.max(0, nextGoal),
          assist: Math.max(0, nextAssist),
        };
      }),
    );
  };

  // 선수 기록 삭제 함수
  const handleDeleteRecord = (event: MatchRecordEvent) => {
    const confirmed = globalThis.confirm("이 기록을 삭제할까요?");
    if (!confirmed) return;
    if (event.type === "goal") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          let nextGoal = player.goal;
          let nextAssist = player.assist;

          if (event.playerId === player.id) {
            nextGoal -= 1;
          }

          if (event.assistPlayerId && event.assistPlayerId === player.id) {
            nextAssist -= 1;
          }

          return {
            ...player,
            goal: Math.max(0, nextGoal),
            assist: Math.max(0, nextAssist),
          };
        }),
      );
    }

    if (editingEventId === event.id) {
      handleCancelEdit();
    }

    deleteEvent(event.id);
  };

  /// 수정 완료 함수
  const handleSubmitEdit = () => {
    if (!editingEventId) return;

    const currentEvent = events.find((event) => event.id === editingEventId);
    if (!currentEvent) return;

    const selectPlayer = players.find(
      (player) => player.id === editingPlayerId,
    );
    const selectedAssistPlayer = players.find(
      (player) => player.id === editingAssistPlayerId,
    );

    updatePlayerStatsForRecordEdit(currentEvent, {
      playerId: editingPlayerId,
      assistPlayerId: editingAssistPlayerId,
    });

    updateEvent(editingEventId, {
      playerId: editingPlayerId,
      playerName: selectPlayer?.name ?? "",
      assistPlayerId: editingAssistPlayerId,
      assistPlayerName: selectedAssistPlayer?.name ?? "",
      quarter: editingQuarter,
      minute: editingMinute,
    });

    handleCancelEdit();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderEvents(String(active.id), String(over.id));
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
              {quarterSections.map((section) => {
                const quarterEvents = groupedEvents[section.key];

                if (quarterEvents.length === 0) {
                  return null;
                }

                return (
                  <div key={section.key} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                          {section.label}
                        </span>
                      </div>

                      <span className="text-sm font-medium text-stone-400">
                        {quarterEvents.length}골
                      </span>
                    </div>

                    <div className="space-y-3">
                      <DndContext
                        onDragEnd={handleDragEnd}
                        collisionDetection={closestCenter}
                      >
                        <SortableContext
                          items={quarterEvents.map((event) => event.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {quarterEvents.map((event) => {
                            const isEditing = editingEventId === event.id;

                            return (
                              <div key={event.id} className="space-y-3">
                                {isEditing && (
                                  <MatchRecordEditPanel
                                    isOpen={!!editingEventId}
                                    eventType={event.type}
                                    attendPlayers={attendPlayers}
                                    editingPlayerId={editingPlayerId}
                                    editingAssistPlayerId={
                                      editingAssistPlayerId
                                    }
                                    editingQuarter={editingQuarter}
                                    editingMinute={editingMinute}
                                    onChangePlayerId={setEditingPlayerId}
                                    onChangeAssistPlayerId={
                                      setEditingAssistPlayerId
                                    }
                                    onChangeQuarter={setEditingQuarter}
                                    onChangeMinute={setEditingMinute}
                                    onCancel={handleCancelEdit}
                                    onSubmit={handleSubmitEdit}
                                  />
                                )}
                                <MatchRecordCard
                                  key={event.id}
                                  event={event}
                                  isEditing={isEditing}
                                  onEdit={() =>
                                    isEditing
                                      ? handleCancelEdit()
                                      : handleStartEdit(event)
                                  }
                                  onDelete={() => handleDeleteRecord(event)}
                                />
                              </div>
                            );
                          })}
                        </SortableContext>
                      </DndContext>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
