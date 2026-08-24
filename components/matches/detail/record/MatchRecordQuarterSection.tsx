import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  MatchRecordEvent,
  MatchRecordQuarter,
  MatchType,
  SelfMatchSide,
} from "@/types/match";
import type { PlayerType } from "@/types/player";

import MatchRecordEditPanel from "./MatchRecordEditPanel";
import type { MatchRecordQuarterSectionItem } from "@/lib/matches/match-record";
import MatchRecordCard from "./MatchRecordCard";

interface MatchRecordQuarterSectionProps {
  matchType: MatchType;
  selfMatchPlayersBySide: Record<SelfMatchSide, PlayerType[]>;
  section: MatchRecordQuarterSectionItem;
  quarterCount: number;
  quarterDurationMinutes: number;
  quarterEvents: MatchRecordEvent[];
  editingEventId: string | null;
  attendPlayers: PlayerType[];
  canManage: boolean;
  onStartEdit: (event: MatchRecordEvent) => void;
  onCancelEdit: () => void;
  onDeleteRecord: (event: MatchRecordEvent) => void;
  onSubmitEdit: (
    eventId: string,
    updates: {
      playerId: string;
      assistPlayerId: string;
      quarter: MatchRecordQuarter;
      minute: string;
    },
  ) => void | Promise<void>;
  onDragEnd: (event: DragEndEvent) => void;
}

export default function MatchRecordQuarterSection({
  matchType,
  selfMatchPlayersBySide,
  section,
  quarterCount,
  quarterDurationMinutes,
  quarterEvents,
  editingEventId,
  attendPlayers,
  canManage,
  onStartEdit,
  onCancelEdit,
  onDeleteRecord,
  onSubmitEdit,
  onDragEnd,
}: Readonly<MatchRecordQuarterSectionProps>) {
  if (quarterEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
            {section.label}
          </span>
        </div>

        <span className="text-sm font-medium text-stone-400">
          {quarterEvents.length}개 기록
        </span>
      </div>

      <div className="space-y-3">
        {canManage ? (
          <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
            <SortableContext
              items={quarterEvents.map((event) => event.id)}
              strategy={verticalListSortingStrategy}
            >
              {quarterEvents.map((event) => {
                const isEditing = editingEventId === event.id;
                const editablePlayers =
                  matchType === "자체전"
                    ? event.type === "goal"
                      ? selfMatchPlayersBySide.team_a
                      : selfMatchPlayersBySide.team_b
                    : attendPlayers;

                return (
                  <div key={event.id} className="space-y-3">
                    {isEditing && (
                      <MatchRecordEditPanel
                        event={event}
                        matchType={matchType}
                        quarterCount={quarterCount}
                        quarterDurationMinutes={quarterDurationMinutes}
                        attendPlayers={editablePlayers}
                        onCancel={onCancelEdit}
                        onSubmit={onSubmitEdit}
                      />
                    )}

                    <MatchRecordCard
                      matchType={matchType}
                      event={event}
                      isEditing={isEditing}
                      canManage={canManage}
                      onEdit={() =>
                        isEditing ? onCancelEdit() : onStartEdit(event)
                      }
                      onDelete={() => onDeleteRecord(event)}
                    />
                  </div>
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          quarterEvents.map((event) => (
            <MatchRecordCard
              key={event.id}
              matchType={matchType}
              event={event}
              isEditing={false}
              canManage={false}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}
