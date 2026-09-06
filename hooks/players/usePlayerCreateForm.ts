import { useToastStore } from "@/stores/toast-store";
import type { PlayerType } from "@/types/player";
import { useState } from "react";

interface UsePlayerCreateFormParams {
  onSave: (player: PlayerType) => void | Promise<void>;
}

export function usePlayerCreateForm({ onSave }: UsePlayerCreateFormParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      showToast("이름을 입력해 주세요.", "info");
      return;
    }

    const nextPlayer: PlayerType = {
      id: crypto.randomUUID(),
      name: trimmedName,
      birth: birth || undefined,
      appearance: 0,
      goal: 0,
      assist: 0,
    };

    setIsSubmitting(true);

    try {
      await onSave(nextPlayer);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    birth,
    setBirth,
    isSubmitting,
    handleSubmit,
  };
}
