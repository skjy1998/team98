// 생성 폼 기본값과 검증
import type { MatchCreateFormValue } from "@/types/match";
import { getDateTimeLocalValue } from "./match-time";

type MatchEditValidationValue = Pick<
  MatchCreateFormValue,
  | "type"
  | "quarterCount"
  | "quarterDurationMinutes"
  | "date"
  | "startTime"
  | "endTime"
  | "voteDeadline"
  | "opponent"
>;

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

export function getMatchEditValidationMessage(value: MatchEditValidationValue) {
  if (!Number.isInteger(value.quarterCount) || value.quarterCount < 1) {
    return "쿼터 수를 1 이상 입력해 주세요.";
  }

  if (
    !Number.isInteger(value.quarterDurationMinutes) ||
    value.quarterDurationMinutes < 5 ||
    value.quarterDurationMinutes > 60
  ) {
    return "쿼터 시간은 5분부터 60분까지 입력해 주세요.";
  }

  if (!value.date) {
    return "날짜를 선택해 주세요.";
  }

  if (!value.startTime || !value.endTime) {
    return "시작 시간과 종료 시간을 모두 입력해 주세요.";
  }

  if (value.startTime >= value.endTime) {
    return "종료 시간은 시작 시간보다 늦어야 해요.";
  }

  if (value.type === "정규" && !value.opponent?.trim()) {
    return "정규 경기는 상대팀을 입력해 주세요.";
  }

  if (!value.voteDeadline) {
    return "투표 마감일을 입력해 주세요.";
  }

  const matchStart = new Date(`${value.date}T${value.startTime}`);
  const voteDeadline = new Date(value.voteDeadline);

  if (
    Number.isNaN(matchStart.getTime()) ||
    Number.isNaN(voteDeadline.getTime())
  ) {
    return "날짜와 시간 형식을 확인해 주세요.";
  }

  if (voteDeadline >= matchStart) {
    return "투표 마감일은 경기 시작 전이어야 해요.";
  }

  return null;
}
