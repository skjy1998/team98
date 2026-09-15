import { getMatchEditValidationMessage } from "@/lib/matches/match-form";
import { getDateTimeLocalValue } from "@/lib/matches/match-time";
import type { MatchCreateFormValue, MatchItem, MatchType } from "@/types/match";
import type { TeamSport } from "@/types/team";
import { useState } from "react";

type MatchInfoEditorState = Required<
  Pick<
    MatchCreateFormValue,
    | "type"
    | "sport"
    | "playersPerSide"
    | "quarterCount"
    | "quarterDurationMinutes"
    | "date"
    | "startTime"
    | "endTime"
    | "voteDeadline"
    | "opponent"
    | "location"
    | "uniform"
  >
>;

interface UseMatchInfoEditorParams {
  match: MatchItem;
  onSave: (value: MatchCreateFormValue) => Promise<void>;
}

function getInitialState(match: MatchItem): MatchInfoEditorState {
  return {
    type: match.type,
    sport: match.sport,
    playersPerSide: match.playersPerSide,
    quarterCount: match.quarterCount,
    quarterDurationMinutes: match.quarterDurationMinutes,
    date: match.date,
    startTime: match.startTime,
    endTime: match.endTime,
    voteDeadline: getDateTimeLocalValue(match.voteDeadline),
    opponent: match.opponent ?? "",
    location: match.location ?? "",
    uniform: match.uniform,
  };
}

function createMatchEditValue(
  form: MatchInfoEditorState,
): MatchCreateFormValue {
  const opponent = form.type === "정규" ? form.opponent.trim() : "";

  return {
    ...form,
    opponent,
    location: form.location.trim(),
    title: form.type === "정규" ? `vs ${opponent}` : "자체전",
  };
}

export function useMatchInfoEditor({
  match,
  onSave,
}: UseMatchInfoEditorParams) {
  const [form, setForm] = useState(() => getInitialState(match));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <Key extends keyof MatchInfoEditorState>(
    key: Key,
    value: MatchInfoEditorState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrorMessage("");
  };

  const handleChangeType = (type: MatchType) => {
    setForm((current) => ({
      ...current,
      type,
      opponent: type === "자체전" ? "" : current.opponent,
    }));

    setErrorMessage("");
  };

  const handleChangeSport = (sport: TeamSport) => {
    setForm((current) => ({
      ...current,
      sport,
      playersPerSide:
        sport === "soccer"
          ? 11
          : current.playersPerSide <= 7
            ? current.playersPerSide
            : 5,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationMessage = getMatchEditValidationMessage(form);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onSave(createMatchEditValue(form));
    } catch (error) {
      console.error("match info edit submit error", error);
      setErrorMessage("경기 정보 수정 중 오류가 발생했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errorMessage,
    isSubmitting,
    updateField,
    handleChangeType,
    handleSubmit,
    handleChangeSport,
  };
}
