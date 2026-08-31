// 생성 폼 기본값과 검증
import type { MatchCreateFormValue } from "@/types/match";
import { getDateTimeLocalValue } from "./match-time";

export function getMatchCreateDefaults() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const defaultDate = `${year}-${month}-${day}`;
  const defaultStartTime = "20:00";
  const defaultEndTime = "22:00";

  const defaultStartAt = new Date(`${defaultDate}T${defaultStartTime}`);

  defaultStartAt.setHours(defaultStartAt.getHours() - 1);

  return {
    defaultDate,
    defaultStartTime,
    defaultEndTime,
    defaultVoteDeadline: getDateTimeLocalValue(defaultStartAt.toISOString()),
    defaultLocation: "",
  };
}

type MatchScheduleValue = Pick<
  MatchCreateFormValue,
  "date" | "startTime" | "endTime" | "voteDeadline"
>;

export function getMatchScheduleValidationMessage({
  date,
  startTime,
  endTime,
  voteDeadline,
}: MatchScheduleValue) {
  if (!date || !startTime || !endTime || !voteDeadline) {
    return "날짜와 경기 시간, 투표 마감일을 모두 입력해 주세요.";
  }

  const matchStart = new Date(`${date}T${startTime}`);
  const matchEnd = new Date(`${date}T${endTime}`);
  const deadline = new Date(voteDeadline);

  if (
    Number.isNaN(matchStart.getTime()) ||
    Number.isNaN(matchEnd.getTime()) ||
    Number.isNaN(deadline.getTime())
  ) {
    return "날짜와 시간 형식을 확인해 주세요.";
  }

  if (matchEnd <= matchStart) {
    return "종료 시간은 시작 시간보다 늦어야 해요.";
  }

  if (deadline >= matchStart) {
    return "투표 마감일은 경기 시작 전이어야 해요.";
  }

  return null;
}
