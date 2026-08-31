// 날짜와 시간
import type { MatchItem } from "@/types/match";

export function formatMatchDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function formatMatchTime(match: MatchItem) {
  return `${match.startTime} - ${match.endTime}`;
}

export function getDateTimeLocalValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function getHasMatchStarted(date: string, startTime: string) {
  if (!date || !startTime) return false;

  const matchStartAt = new Date(`${date}T${startTime}`);

  if (Number.isNaN(matchStartAt.getTime())) return false;

  return matchStartAt.getTime() <= Date.now();
}

export function getIsUpcomingMatch(date: string, startTime: string) {
  return !getHasMatchStarted(date, startTime);
}
