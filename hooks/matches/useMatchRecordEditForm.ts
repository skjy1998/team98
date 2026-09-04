import { createQuarterOptions } from "@/lib/matches/match-quarter";
import { getMatchRecordMinuteValidationMessage } from "@/lib/matches/match-record";
import type {
  MatchRecordQuarter,
  MatchRecordEditValue,
  MatchRecordEvent,
} from "@/types/match";
import { useMemo, useState } from "react";

interface UseMatchRecordEditFormParams {
  event: MatchRecordEvent;
  quarterCount: number;
  quarterDurationMinutes: number;
  onSubmit: (
    eventId: string,
    updates: MatchRecordEditValue,
  ) => void | Promise<void>;
}

export function useMatchRecordEditForm({
  event,
  quarterCount,
  quarterDurationMinutes,
  onSubmit,
}: UseMatchRecordEditFormParams) {
  const quarterOptions = useMemo<MatchRecordQuarter[]>(
    () => ["unknown", ...createQuarterOptions(quarterCount)],
    [quarterCount],
  );

  const [playerId, setPlayerId] = useState(event.playerId ?? "");
  const [assistPlayerId, setAssistPlayerId] = useState(
    event.assistPlayerId ?? "",
  );
  const [quarter, setQuarter] = useState<MatchRecordQuarter>(() =>
    event.quarter && quarterOptions.includes(event.quarter)
      ? event.quarter
      : "unknown",
  );
  const [minute, setMinute] = useState(event.minute ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeMinute = (value: string) => {
    setMinute(value);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationMessage = getMatchRecordMinuteValidationMessage(
      minute,
      quarterDurationMinutes,
    );

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onSubmit(event.id, {
        playerId,
        assistPlayerId,
        quarter,
        minute,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    quarterOptions,
    playerId,
    assistPlayerId,
    quarter,
    minute,
    errorMessage,
    isSubmitting,
    setPlayerId,
    setAssistPlayerId,
    setQuarter,
    handleChangeMinute,
    handleSubmit,
  };
}
