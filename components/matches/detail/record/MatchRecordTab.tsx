import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchType,
} from "@/types/match";
import { useMemo } from "react";
import MatchRecordScoreActions from "./MatchRecordScoreActions";
import {
  createMatchRecordQuarterSections,
  getGroupedMatchRecordEvents,
  getSelfMatchPlayersBySide,
} from "@/lib/matches/match-record";
import MatchRecordQuarterSection from "./MatchRecordQuarterSection";
import ContentState from "@/components/common/ContentState";
import MatchRecordInclusionToggle from "./MatchRecordInclusionToggle";
import { useMatchRecordStatusActions } from "@/hooks/matches/useMatchRecordStatusActions";
import { useMatchRecordEventActions } from "@/hooks/matches/useMatchRecordEventActions";

interface MatchRecordTabProps {
  votes: MatchVote[];
  attendPlayers: PlayerType[];
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
  votes,
  attendPlayers,
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
  const {
    isCompleted,
    canEdit,
    isCompletionSaving,
    isInclusionSaving,
    handleChangeCompletion,
    handleChangeRecordInclusion,
  } = useMatchRecordStatusActions({
    canManage,
    hasMatchStarted,
    recordCompletedAt,
    countsTowardRecord,
    onChangeCompletion,
    onChangeRecordInclusion,
  });

  const {
    editingEventId,
    handleStartEdit,
    handleCancelEdit,
    handleAddEvent,
    handleDeleteRecord,
    handleSubmitEdit,
    handleDragEnd,
  } = useMatchRecordEventActions({
    canEdit,
    attendPlayers,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
  });

  const quarterSections = useMemo(
    () => createMatchRecordQuarterSections(quarterCount),
    [quarterCount],
  );

  const groupedEvents = useMemo(
    () => getGroupedMatchRecordEvents(events, quarterCount),
    [events, quarterCount],
  );

  const selfMatchPlayersBySide = useMemo(
    () => getSelfMatchPlayersBySide(attendPlayers, votes),
    [attendPlayers, votes],
  );

  if (!recordsLoaded) {
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
