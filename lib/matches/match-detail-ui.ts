// 상세 화면 계산
import type { MatchDetailTab, MatchItem } from "@/types/match";
import { getMatchResult, getOpponentName, statusMap } from "./match-display";

export function getMatchDetailStatusLabel(match: MatchItem) {
  const result = getMatchResult(match);

  if (result === "scheduled") {
    return match.isUpcoming ? "예정" : "기록 전";
  }

  if (match.type === "자체전") {
    if (result === "win") return "A팀 승";
    if (result === "lose") return "B팀 승";

    return "무승부";
  }

  if (result === "win") return "승";
  if (result === "lose") return "패";

  return "무";
}

export function getMatchDetailSubText(match: MatchItem) {
  const result = getMatchResult(match);

  if (result === "scheduled") {
    return match.isUpcoming ? "경기 전" : "기록 대기";
  }

  if (result === "canceled") {
    return "취소됨";
  }

  return "종료";
}

export function getMatchDetailDisplay(match: MatchItem) {
  const displayScore =
    match.ourScore !== undefined && match.opponentScore !== undefined
      ? `${match.ourScore}: ${match.opponentScore}`
      : "-";

  const result = getMatchResult(match);
  const status = statusMap[result];

  return {
    displayScore,
    matchStatusLabel: getMatchDetailStatusLabel(match),
    matchSubText: getMatchDetailSubText(match),
    opponentName: getOpponentName(match),
    statusBadgeClassName: status.badgeClassName,
  };
}

export function getMatchDetailTab(value: string | null): MatchDetailTab {
  return value === "info" ||
    value === "vote" ||
    value === "attendance" ||
    value === "tactics" ||
    value === "record"
    ? value
    : "info";
}
