import { MatchItem, MatchRecordMap, MatchType } from "@/types/match";

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

export function getMatchStatusLabel(result: MatchResultStatus) {
  if (result === "win") return "승";
  if (result === "lose") return "패";
  if (result === "draw") return "무";
  if (result === "canceled") return "취소";
  return "예정";
}

export function getOpponentName(match: MatchItem) {
  if (match.type === "자체전") {
    return "자체전";
  }
  return match.opponent || match.title.replace("vs ", "");
}

export function formatMatchTime(match: MatchItem) {
  return `${match.startTime} - ${match.endTime}`;
}

export function formatMatchDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function getMatchScoreText(match: MatchItem) {
  if (match.ourScore === undefined || match.opponentScore === undefined) {
    return null;
  }
  return `${match.ourScore} : ${match.opponentScore}`;
}

export function getMatchValueText(match: MatchItem) {
  const result = getMatchResult(match);
  if (result != "scheduled") {
    return getMatchScoreText(match) ?? "";
  }
  return match.isUpcoming ? "경기 전" : "기록 전";
}

export function shouldShowMatchStatusBadge(match: MatchItem) {
  const result = getMatchResult(match);

  if (result === "scheduled" && !match.isUpcoming) {
    return false;
  }
  return true;
}

export function getMatchDetailStatusLabel(match: MatchItem) {
  const result = getMatchResult(match);

  if (result === "scheduled") {
    return match.isUpcoming ? "예정" : "기록 전";
  }
  if (result === "canceled") {
    return "취소";
  }
  if (result === "win") {
    return "승";
  }
  if (result === "lose") {
    return "패";
  }
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

export function getIsUpcomingMatch(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const matchDate = new Date(date);
  matchDate.setHours(0, 0, 0, 0);

  return matchDate >= today;
}

// matches 원본과 records를 받아서 화면에 보여줄 경기 목록으로 바꿔주는 역할
export function getDisplayMatches(
  matches: MatchItem[],
  records: MatchRecordMap,
) {
  return matches.map((match) => {
    const events = records[match.id] ?? [];
    const isUpcoming = getIsUpcomingMatch(match.date);

    if (events.length === 0) {
      return {
        ...match,
        isUpcoming,
      };
    }
    const ourScore = events.filter((event) => event.type === "goal").length;
    const opponentScore = events.filter(
      (event) => event.type === "concede",
    ).length;

    return {
      ...match,
      ourScore,
      opponentScore,
      isUpcoming,
    };
  });
}
