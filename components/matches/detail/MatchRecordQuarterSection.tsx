import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { MatchRecordEvent, MatchRecordQuarter } from "@/types/match";
import type { PlayerType } from "@/types/player";
import MatchRecordCard from "./MatchRecordCard";
import MatchRecordEditPanel from "./MatchRecordEditPanel";
import { MatchRecordQuarterSectionItem } from "@/lib/match-record";

interface EditingRecordForm {
  eventId: string | null;
  playerId: string;
  assistPlayerId: string;
  quarter: MatchRecordQuarter;
  minute: string;
}

interface MatchRecordQuarterSectionProps {
  section: MatchRecordQuarterSectionItem;
  quarterEvents: MatchRecordEvent[];
  editingForm: EditingRecordForm;
  attendPlayers: PlayerType[];
  canManage: boolean;
  onStartEdit: (event: MatchRecordEvent) => void;
  onCancelEdit: () => void;
  onDeleteRecord: (event: MatchRecordEvent) => void;
  onSubmitEdit: () => void;
  onDragEnd: (event: DragEndEvent) => void;
  onChangePlayerId: (value: string) => void;
  onChangeAssistPlayerId: (value: string) => void;
  onChangeQuarter: (value: MatchRecordQuarter) => void;
  onChangeMinute: (value: string) => void;
}

export default function MatchRecordQuarterSection({
  section,
  quarterEvents,
  editingForm,
  attendPlayers,
  canManage,
  onStartEdit,
  onCancelEdit,
  onDeleteRecord,
  onSubmitEdit,
  onDragEnd,
  onChangePlayerId,
  onChangeAssistPlayerId,
  onChangeQuarter,
  onChangeMinute,
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
          {quarterEvents.length}골
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
                const isEditing = editingForm.eventId === event.id;

                return (
                  <div key={event.id} className="space-y-3">
                    {canManage && isEditing && (
                      <MatchRecordEditPanel
                        isOpen={isEditing}
                        eventType={event.type}
                        attendPlayers={attendPlayers}
                        editingPlayerId={editingForm.playerId}
                        editingAssistPlayerId={editingForm.assistPlayerId}
                        editingQuarter={editingForm.quarter}
                        editingMinute={editingForm.minute}
                        onChangePlayerId={onChangePlayerId}
                        onChangeAssistPlayerId={onChangeAssistPlayerId}
                        onChangeQuarter={onChangeQuarter}
                        onChangeMinute={onChangeMinute}
                        onCancel={onCancelEdit}
                        onSubmit={onSubmitEdit}
                      />
                    )}

                    <MatchRecordCard
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
