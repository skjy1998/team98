// 결과와 공통 표시
import type { MatchItem, MatchType } from "@/types/match";
import type { TeamSport } from "@/types/team";

export type MatchResultStatus =
  | "scheduled"
  | "win"
  | "lose"
  | "draw"
  | "canceled";

export const statusMap: Record<
  MatchResultStatus,
  {
    label: string;
    badgeClassName: string;
    valueText: string;
    scoreClassName: string;
  }
> = {
  scheduled: {
    label: "예정",
    badgeClassName: "bg-emerald-50 text-emerald-700",
    valueText: "경기 전",
    scoreClassName: "text-emerald-700",
  },
  win: {
    label: "승",
    badgeClassName: "bg-emerald-50 text-emerald-700",
    valueText: "",
    scoreClassName: "text-emerald-700",
  },
  lose: {
    label: "패",
    badgeClassName: "bg-rose-50 text-rose-600",
    valueText: "",
    scoreClassName: "text-rose-600",
  },
  draw: {
    label: "무",
    badgeClassName: "bg-stone-100 text-stone-600",
    valueText: "",
    scoreClassName: "text-stone-700",
  },
  canceled: {
    label: "취소",
    badgeClassName: "bg-stone-100 text-stone-500",
    valueText: "취소됨",
    scoreClassName: "text-stone-400",
  },
};

export const typeMap: Record<MatchType, string> = {
  정규: "bg-emerald-50 text-emerald-700",
  자체전: "bg-sky-50 text-sky-600",
};

export const matchSportMap: Record<
  TeamSport,
  { label: string; className: string }
> = {
  soccer: {
    label: "축구",
    className: "bg-emerald-50 text-emerald-700",
  },
  futsal: {
    label: "풋살",
    className: "bg-cyan-50 text-cyan-700",
  },
};
export function getMatchResult(match: MatchItem): MatchResultStatus {
  if (match.status === "canceled") {
    return "canceled";
  }

  if (match.ourScore === undefined || match.opponentScore === undefined) {
    return "scheduled";
  }

  if (match.ourScore > match.opponentScore) {
    return "win";
  }

  if (match.ourScore < match.opponentScore) {
    return "lose";
  }

  return "draw";
}

export function getOpponentName(match: MatchItem) {
  if (match.type === "자체전") {
    return "자체전";
  }

  return match.opponent || match.title.replace("vs ", "");
}

export function getMatchScoreText(match: MatchItem) {
  if (match.ourScore === undefined || match.opponentScore === undefined) {
    return null;
  }

  return `${match.ourScore} : ${match.opponentScore}`;
}
