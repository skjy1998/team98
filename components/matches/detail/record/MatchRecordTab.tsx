import { usePlayers } from "@/hooks/players/usePlayers";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordQuarter,
  MatchType,
} from "@/types/match";
import { useMemo, useState } from "react";
import MatchRecordScoreActions from "./MatchRecordScoreActions";
import { useMatchVotes } from "@/hooks/matches/useMatchVotes";
import {
  createMatchRecordQuarterSections,
  getAttendPlayerIdsByVotes,
  getAttendPlayers,
  getGroupedMatchRecordEvents,
} from "@/lib/matches/match-record";
import type { DragEndEvent } from "@dnd-kit/core";
import MatchRecordQuarterSection from "./MatchRecordQuarterSection";
import ContentState from "@/components/common/ContentState";
import { useToastStore } from "@/stores/toast-store";
import { useConfirmStore } from "@/stores/confirm-store";
import MatchRecordInclusionToggle from "./MatchRecordInclusionToggle";

interface MatchRecordTabProps {
  matchId: string;
  matchType: MatchType;
  countsTowardRecord: boolean;
  onChangeRecordInclusion: (countsTowardRecord: boolean) => Promise<boolean>;
  quarterCount: number;
  quarterDurationMinutes: number;
  events: MatchRecordEvent[];
  recordsLoaded: boolean;
  recordCompletedAt?: string;
  hasMatchStarted: boolean;
  addEvent: (type: MatchRecordEventType) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  updateEvent: (
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => Promise<boolean>;
  reorderEvents: (activeId: string, overId: string) => Promise<boolean>;
  onChangeCompletion: (completed: boolean) => Promise<boolean>;
  canManage: boolean;
}

export default function MatchRecordTab({
  matchId,
  matchType,
  countsTowardRecord,
  onChangeRecordInclusion,
  quarterCount,
  quarterDurationMinutes,
  events,
  recordsLoaded,
  recordCompletedAt,
  hasMatchStarted,
  addEvent,
  deleteEvent,
  updateEvent,
  reorderEvents,
  onChangeCompletion,
  canManage,
}: Readonly<MatchRecordTabProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const { players, playersLoaded } = usePlayers();
  const { votes, votesLoaded } = useMatchVotes();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [isCompletionSaving, setIsCompletionSaving] = useState(false);
  const [isInclusionSaving, setIsInclusionSaving] = useState(false);

  const isCompleted = Boolean(recordCompletedAt);
  const canEdit = canManage && hasMatchStarted && !isCompleted;

  const quarterSections = useMemo(
    () => createMatchRecordQuarterSections(quarterCount),
    [quarterCount],
  );

  const groupedEvents = useMemo(
    () => getGroupedMatchRecordEvents(events, quarterCount),
    [events, quarterCount],
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

  const currentVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);

  const selfMatchPlayersBySide = useMemo(() => {
    const teamAPlayerIds = new Set(
      currentVotes
        .filter((vote) => vote.status === "attend" && vote.side === "team_a")
        .map((vote) => vote.playerId),
    );

    const teamBPlayerIds = new Set(
      currentVotes
        .filter((vote) => vote.status === "attend" && vote.side === "team_b")
        .map((vote) => vote.playerId),
    );

    return {
      team_a: attendPlayers.filter((player) => teamAPlayerIds.has(player.id)),
      team_b: attendPlayers.filter((player) => teamBPlayerIds.has(player.id)),
    };
  }, [currentVotes, attendPlayers]);

  const handleChangeCompletion = async () => {
    if (!canManage || !hasMatchStarted || isCompletionSaving) return;

    const confirmed = await confirm({
      title: isCompleted ? "경기 기록 다시 열기" : "경기 기록 완료",
      description: isCompleted
        ? "완료된 경기 기록을 다시 수정할 수 있는 상태로 변경할까요?"
        : "경기 기록을 완료할까요? 0:0 경기라면 기록이 없어도 완료할 수 있어요.",
      confirmLabel: isCompleted ? "다시 열기" : "완료",
    });

    if (!confirmed) return;

    setIsCompletionSaving(true);

    const success = await onChangeCompletion(!isCompleted);

    setIsCompletionSaving(false);

    if (!success) {
      showToast("경기 기록 상태 변경에 실패했어요.", "error");
      return;
    }

    showToast(
      isCompleted
        ? "경기 기록을 다시 수정할 수 있어요."
        : "경기 기록을 완료 처리했어요.",
      "success",
    );
  };

  const handleChangeRecordInclusion = async () => {
    if (!canManage || isInclusionSaving) return;

    setIsInclusionSaving(true);

    const success = await onChangeRecordInclusion(!countsTowardRecord);

    setIsInclusionSaving(false);

    if (!success) {
      showToast("전적 반영 설정 변경에 실패했어요.", "error");
      return;
    }

    showToast(
      countsTowardRecord
        ? "이 경기를 팀 전적에서 제외했어요."
        : "이 경기를 팀 전적에 반영했어요.",
      "success",
    );
  };

  // 수정 시작 함수
  const handleStartEdit = (event: MatchRecordEvent) => {
    if (!canEdit) return;

    setEditingEventId(event.id);
  };

  // 수정 취소 함수
  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const handleAddEvent = async (type: MatchRecordEventType) => {
    if (!canEdit) return;

    const success = await addEvent(type);

    if (!success) {
      showToast("기록 추가에 실패했어요.", "error");
    }
  };

  // 선수 기록 삭제 함수
  const handleDeleteRecord = async (event: MatchRecordEvent) => {
    if (!canEdit) return;

    const confirmed = await confirm({
      title: "경기 기록 삭제",
      description: "이 경기 기록을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    if (editingEventId === event.id) {
      handleCancelEdit();
    }

    const success = await deleteEvent(event.id);

    if (!success) {
      showToast("기록 삭제에 실패했어요.", "error");
      return;
    }

    showToast("경기 기록을 삭제했어요.", "success");
  };
  // 수정 완료 함수
  const handleSubmitEdit = async (
    eventId: string,
    updates: {
      playerId: string;
      assistPlayerId: string;
      quarter: MatchRecordQuarter;
      minute: string;
    },
  ) => {
    if (!canEdit) return;

    const selectedPlayer = players.find(
      (player) => player.id === updates.playerId,
    );
    const selectedAssistPlayer = players.find(
      (player) => player.id === updates.assistPlayerId,
    );

    const success = await updateEvent(eventId, {
      playerId: updates.playerId,
      playerName: selectedPlayer?.name ?? "",
      assistPlayerId: updates.assistPlayerId,
      assistPlayerName: selectedAssistPlayer?.name ?? "",
      quarter: updates.quarter,
      minute: updates.minute,
    });

    if (!success) {
      showToast("기록 수정에 실패했어요.", "error");
      return;
    }

    handleCancelEdit();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!canEdit) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const success = await reorderEvents(String(active.id), String(over.id));

    if (!success) {
      showToast("기록 순서 변경에 실패했어요.", "error");
    }
  };

  if (!playersLoaded || !recordsLoaded || !votesLoaded) {
    return (
      <ContentState
        variant="loading"
        title="기록 정보를 불러오는 중..."
        description="경기 기록과 선수 데이터를 준비하고 있어요."
      />
    );
  }

  return (
    <div className="space-y-5">
      <MatchRecordInclusionToggle
        enabled={countsTowardRecord}
        disabled={!canManage || isInclusionSaving}
        onChange={() => void handleChangeRecordInclusion()}
      />
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                isCompleted
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              {isCompleted ? "기록 완료" : "작성 중"}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-400">
            {isCompleted
              ? "완료된 기록은 다시 수정하기 전까지 잠겨요."
              : "기록 입력이 끝나면 완료 상태로 변경해 주세요."}
          </p>
        </div>

        {canManage && hasMatchStarted && (
          <button
            type="button"
            disabled={isCompletionSaving}
            onClick={handleChangeCompletion}
            className={[
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
              isCompleted
                ? "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            ].join(" ")}
          >
            {isCompletionSaving
              ? "처리 중..."
              : isCompleted
                ? "다시 수정"
                : "기록 완료"}
          </button>
        )}
      </div>
      {canManage && !hasMatchStarted && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
          경기 시작 전에는 기록을 입력할 수 없어요.
        </div>
      )}

      {canEdit && (
        <MatchRecordScoreActions
          matchType={matchType}
          onAddEvent={handleAddEvent}
        />
      )}
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          경기 기록은 운영진만 수정할 수 있어요.
        </div>
      )}
      {canManage && isCompleted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          완료된 경기 기록이에요. 수정하려면 먼저 다시 수정 버튼을 눌러 주세요.
        </div>
      )}

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">경기 기록</h2>
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
                  matchType={matchType}
                  selfMatchPlayersBySide={selfMatchPlayersBySide}
                  section={section}
                  quarterCount={quarterCount}
                  quarterDurationMinutes={quarterDurationMinutes}
                  quarterEvents={groupedEvents[section.key] ?? []}
                  editingEventId={editingEventId}
                  attendPlayers={attendPlayers}
                  canManage={canEdit}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onDeleteRecord={handleDeleteRecord}
                  onSubmitEdit={handleSubmitEdit}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
