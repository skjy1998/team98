import type { MatchCreateFormValue, MatchItem } from "@/types/match";
import { useMemo, useState } from "react";
import MatchInfoDisplay from "@/components/matches/detail/MatchInfoDisplay";
import MatchInfoEditor from "@/components/matches/detail/MatchInfoEditor";
import MatchOpponentRecordCard from "./MatchOpponentRecordCard";
import { getOpponentRecordSummary } from "@/lib/matches/match-ui";

interface MatchInfoTabProps {
  match: MatchItem;
  matches: MatchItem[];
  onSave: (value: MatchCreateFormValue) => Promise<boolean>;
  onDelete: () => void;
  canManage: boolean;
}

export function MatchInfoTab({
  match,
  matches,
  onSave,
  onDelete,
  canManage,
}: Readonly<MatchInfoTabProps>) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = () => {
    if (!canManage) return;
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (value: MatchCreateFormValue) => {
    const success = await onSave(value);

    if (!success) {
      return;
    }

    setIsEditing(false);
  };

  const opponentRecord = useMemo(() => {
    if (match.type !== "정규" || !match.opponent) {
      return null;
    }

    return getOpponentRecordSummary(matches, match.opponent, match.id);
  }, [match, matches]);

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
          canManage={canManage}
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
