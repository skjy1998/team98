import type { MatchCreateFormValue, MatchItem } from "@/types/match";
import { useState } from "react";
import MatchInfoDisplay from "@/components/matches/detail/MatchInfoDisplay";
import MatchInfoEditor from "@/components/matches/detail/MatchInfoEditor";
import MatchOpponentRecordCard from "./MatchOpponentRecordCard";
import { getOpponentRecordSummary } from "@/lib/match-ui";

interface MatchInfoTabProps {
  match: MatchItem;
  matches: MatchItem[];
  onSave: (value: MatchCreateFormValue) => void;
  onDelete: () => void;
}

export function MatchInfoTab({
  match,
  matches,
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

  const opponentRecord =
    match.type === "정규" && match.opponent
      ? getOpponentRecordSummary(matches, match.opponent, match.id)
      : null;

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

      {match.type === "정규" && match.opponent && opponentRecord && (
        <MatchOpponentRecordCard
          opponent={match.opponent}
          summary={opponentRecord}
        />
      )}
    </div>
  );
}
