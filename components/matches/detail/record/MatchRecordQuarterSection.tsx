import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  MatchRecordEditValue,
  MatchRecordEvent,
  MatchType,
  SelfMatchSide,
} from "@/types/match";
import type { PlayerType } from "@/types/player";

import MatchRecordEditPanel from "./MatchRecordEditPanel";
import type { MatchRecordQuarterSectionItem } from "@/lib/matches/match-record";
import MatchRecordCard from "./MatchRecordCard";
import { useState } from "react";

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
    updates: MatchRecordEditValue,
  ) => void | Promise<void>;
  onDragEnd: (event: DragEndEvent) => void;
}

function getEditablePlayers(
  matchType: MatchType,
  event: MatchRecordEvent,
  attendPlayers: PlayerType[],
  playersBySide: Record<SelfMatchSide, PlayerType[]>,
) {
  if (matchType !== "자체전") {
    return attendPlayers;
  }

  return event.type === "goal" ? playersBySide.team_a : playersBySide.team_b;
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
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
  );

  if (quarterEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:px-3 sm:text-sm">
            {section.label}
          </span>
        </div>

        <span className="text-xs font-medium text-stone-400 sm:text-sm">
          {quarterEvents.length}개 기록
        </span>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {canManage ? (
          <DndContext
            sensors={sensors}
            onDragStart={({ active }) => setActiveEventId(String(active.id))}
            onDragCancel={() => setActiveEventId(null)}
            onDragEnd={(dragEvent) => {
              setActiveEventId(null);
              onDragEnd(dragEvent);
            }}
            collisionDetection={closestCenter}
          >
            <SortableContext
              items={quarterEvents.map((event) => event.id)}
              strategy={verticalListSortingStrategy}
            >
              {quarterEvents.map((event) => {
                const isEditing = editingEventId === event.id;
                const editablePlayers = getEditablePlayers(
                  matchType,
                  event,
                  attendPlayers,
                  selfMatchPlayersBySide,
                );

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
                      isDragging={activeEventId === event.id}
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
            />
          ))
        )}
      </div>
    </div>
  );
}
