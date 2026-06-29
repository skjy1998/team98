import type { MatchCreateFormValue, MatchItem } from "@/types/match";
import { useState } from "react";
import MatchInfoDisplay from "@/components/matches/detail/MatchInfoDisplay";
import MatchInfoEditor from "@/components/matches/detail/MatchInfoEditor";

interface MatchInfoTabProps {
  match: MatchItem;
  onSave: (value: MatchCreateFormValue) => void;
  onDelete: () => void;
}

export function MatchInfoTab({
  match,
  onSave,
  onDelete,
}: Readonly<MatchInfoTabProps>) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = (value: MatchCreateFormValue) => {
    onSave(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      {isEditing ? (
        <MatchInfoEditor
          match={match}
          onCancel={handleCancelEdit}
          onSave={handleSave}
        />
      ) : (
        <MatchInfoDisplay
          match={match}
          onEdit={handleStartEdit}
          onDelete={onDelete}
        />
      )}

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">메모</h2>
        <p className="mt-4 text-sm leading-7 text-stone-500">
          경기 관련 상세 정보
        </p>
      </section>
    </div>
  );
}
