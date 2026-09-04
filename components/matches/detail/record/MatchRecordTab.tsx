import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchType,
} from "@/types/match";
import MatchRecordScoreActions from "./MatchRecordScoreActions";
import MatchRecordQuarterSection from "./MatchRecordQuarterSection";
import ContentState from "@/components/common/ContentState";
import MatchRecordInclusionToggle from "./MatchRecordInclusionToggle";
import { useMatchRecordStatusActions } from "@/hooks/matches/useMatchRecordStatusActions";
import { useMatchRecordEventActions } from "@/hooks/matches/useMatchRecordEventActions";
import MatchRecordStatusPanel from "./MatchRecordStatusPanel";
import { useMatchRecordViewData } from "@/hooks/matches/useMatchRecordViewData";

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

  const { quarterSections, groupedEvents, selfMatchPlayersBySide } =
    useMatchRecordViewData({
      events,
      quarterCount,
      attendPlayers,
      votes,
    });

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
      <MatchRecordStatusPanel
        isCompleted={isCompleted}
        canManage={canManage}
        hasMatchStarted={hasMatchStarted}
        isCompletionSaving={isCompletionSaving}
        onChangeCompletion={handleChangeCompletion}
      />
      {canEdit && (
        <MatchRecordScoreActions
          matchType={matchType}
          onAddEvent={handleAddEvent}
        />
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
