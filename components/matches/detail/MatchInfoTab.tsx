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

  return (
    <div className="space-y-5">
      {isEditing ? (
        <MatchInfoEditor
          match={match}
          onCancel={() => setIsEditing(false)}
          onSave={(value) => {
            onSave(value);
            setIsEditing(false);
          }}
        />
      ) : (
        <MatchInfoDisplay
          match={match}
          onEdit={() => setIsEditing(true)}
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
