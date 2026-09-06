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

interface PlayerEditFormState {
  number: string;
  detailPositions: PlayerDetailPosition[];
  birth: string;
  role: PlayerRole;
  preferredFoot: PlayerPreferredFoot;
  note: string;
  teamRole: TeamMemberRole;
  linkedUserId: string;
}

function getInitialEditState(player: PlayerType): PlayerEditFormState {
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
  const [form, setForm] = useState<PlayerEditFormState>(() =>
    getInitialEditState(player),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <Key extends keyof PlayerEditFormState>(
    key: Key,
    value: PlayerEditFormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleToggleDetailPosition = (detail: PlayerDetailPosition) => {
    setForm((current) => ({
      ...current,
      detailPositions: current.detailPositions.includes(detail)
        ? current.detailPositions.filter((item) => item !== detail)
        : [...current.detailPositions, detail],
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const nextPlayer: PlayerType = {
      ...player,
      userId: form.linkedUserId || undefined,
      number: form.number ? Number(form.number) : undefined,
      detailPositions:
        form.detailPositions.length > 0 ? form.detailPositions : undefined,
      birth: form.birth || undefined,
      role: form.role,
      preferredFoot: form.preferredFoot,
      note: form.note.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      await onSave(nextPlayer, form.teamRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    updateField,
    handleToggleDetailPosition,
    handleSubmit,
  };
}
