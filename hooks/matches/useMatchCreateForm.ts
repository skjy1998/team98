import {
  getMatchCreateDefaults,
  getMatchScheduleValidationMessage,
} from "@/lib/matches/match-form";
import { useToastStore } from "@/stores/toast-store";
import type {
  MatchCreateFormValue,
  MatchType,
  MatchUniform,
} from "@/types/match";
import type { TeamSport } from "@/types/team";
import { useMemo, useState } from "react";

interface UseMatchCreateFormParams {
  defaultSport: TeamSport;
  onSave: (value: MatchCreateFormValue) => Promise<boolean>;
}

export function useMatchCreateForm({
  defaultSport,
  onSave,
}: UseMatchCreateFormParams) {
  const showToast = useToastStore((state) => state.showToast);

  const defaults = useMemo(() => getMatchCreateDefaults(), []);

  const [type, setType] = useState<MatchType>("정규");
  const [sport, setSport] = useState<TeamSport>(defaultSport);
  const [date, setDate] = useState(defaults.defaultDate);
  const [startTime, setStartTime] = useState(defaults.defaultStartTime);
  const [endTime, setEndTime] = useState(defaults.defaultEndTime);
  const [voteDeadline, setVoteDeadline] = useState(
    defaults.defaultVoteDeadline,
  );
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState(defaults.defaultLocation);
  const [uniform, setUniform] = useState<MatchUniform>("home");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationMessage = getMatchScheduleValidationMessage({
      date,
      startTime,
      endTime,
      voteDeadline,
    });

    if (validationMessage) {
      showToast(validationMessage, "info");
      return;
    }

    const title =
      type === "정규" ? `vs ${opponent || "상대팀 미정"}` : "자체전";

    setIsSubmitting(true);

    try {
      const success = await onSave({
        title,
        type,
        sport,
        playersPerSide: sport === "futsal" ? 5 : 11,
        quarterCount: 4,
        quarterDurationMinutes: 20,
        date,
        startTime,
        endTime,
        voteDeadline,
        opponent: type === "정규" ? opponent : "",
        location,
        uniform,
      });

      if (!success) {
        showToast("경기 일정 등록에 실패했어요.", "error");
      }
    } catch (error) {
      console.error("match create submit error", error);
      showToast("경기 일정 등록 중 오류가 발생했어요.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    typeState: {
      type,
      onChangeType: setType,
    },
    sportState: {
      sport,
      onChangeSport: setSport,
    },
    scheduleState: {
      date,
      onChangeDate: setDate,
      startTime,
      onChangeStartTime: setStartTime,
      endTime,
      onChangeEndTime: setEndTime,
      voteDeadline,
      onChangeVoteDeadline: setVoteDeadline,
    },
    opponentState: {
      type,
      opponent,
      onChangeOpponent: setOpponent,
    },
    locationState: {
      location,
      onChangeLocation: setLocation,
    },
    uniformState: {
      uniform,
      onChangeUniform: setUniform,
    },
    isSubmitting,
    onSubmit: handleSubmit,
  };
}
