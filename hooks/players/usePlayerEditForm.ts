import type {
  PlayerDetailPosition,
  PlayerPreferredFoot,
  PlayerRole,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { useState } from "react";

interface UsePlayerEditFormParams {
  player: PlayerType;
  onSave: (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => void | Promise<void>;
}

function getInitialEditState(player: PlayerType) {
  return {
    number: player.number ? String(player.number) : "",
    detailPositions: player.detailPositions ?? [],
    birth: player.birth ?? "",
    role: player.role ?? "member",
    preferredFoot: player.preferredFoot ?? "right",
    note: player.note ?? "",
    teamRole: player.teamMemberRole ?? "member",
    linkedUserId: player.userId ?? "",
  };
}

export function usePlayerEditForm({
  player,
  onSave,
}: Readonly<UsePlayerEditFormParams>) {
  const initialState = getInitialEditState(player);

  const [number, setNumber] = useState(initialState.number);
  const [detailPositions, setDetailPositions] = useState<
    PlayerDetailPosition[]
  >(initialState.detailPositions);
  const [birth, setBirth] = useState(initialState.birth);
  const [role, setRole] = useState<PlayerRole>(initialState.role);
  const [preferredFoot, setPreferredFoot] = useState<PlayerPreferredFoot>(
    initialState.preferredFoot,
  );
  const [note, setNote] = useState(initialState.note);
  const [teamRole, setTeamRole] = useState<TeamMemberRole>(
    initialState.teamRole,
  );
  const [linkedUserId, setLinkedUserId] = useState(initialState.linkedUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleDetailPosition = (detail: PlayerDetailPosition) => {
    setDetailPositions((current) =>
      current.includes(detail)
        ? current.filter((item) => item !== detail)
        : [...current, detail],
    );
  };

  const handleSubmit = async () => {
    const nextPlayer: PlayerType = {
      ...player,
      userId: linkedUserId || undefined,
      number: number ? Number(number) : undefined,
      detailPositions: detailPositions.length > 0 ? detailPositions : undefined,
      birth: birth || undefined,
      role,
      preferredFoot,
      note: note.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      await onSave(nextPlayer, teamRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    number,
    setNumber,
    detailPositions,
    birth,
    setBirth,
    role,
    setRole,
    preferredFoot,
    setPreferredFoot,
    note,
    setNote,
    teamRole,
    setTeamRole,
    linkedUserId,
    setLinkedUserId,
    isSubmitting,
    handleToggleDetailPosition,
    handleSubmit,
  };
}
