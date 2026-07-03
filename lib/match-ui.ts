import {
  MatchDetailTab,
  MatchItem,
  MatchOpponentRecordItem,
  MatchOpponentRecordSummary,
  MatchRecordMap,
  MatchType,
} from "@/types/match";

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

export function getOpponentRecordSummary(
  matches: MatchItem[],
  opponent: string,
  currentMatchId: string,
): MatchOpponentRecordSummary {
  const opponentMatches = matches
    .filter(
      (match) =>
        match.id !== currentMatchId &&
        match.type === "정규" &&
        match.opponent === opponent &&
        match.ourScore !== undefined &&
        match.opponentScore !== undefined,
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const summary = opponentMatches.reduce(
    (acc, match) => {
      const ourScore = match.ourScore ?? 0;
      const opponentScore = match.opponentScore ?? 0;

      acc.totalMatches += 1;
      acc.goals += ourScore;
      acc.conceded += opponentScore;

      if (ourScore > opponentScore) {
        acc.win += 1;
      } else if (ourScore < opponentScore) {
        acc.lose += 1;
      } else {
        acc.draw += 1;
      }
      return acc;
    },
    {
      totalMatches: 0,
      win: 0,
      draw: 0,
      lose: 0,
      goals: 0,
      conceded: 0,
    },
  );
  const recentMatches: MatchOpponentRecordItem[] = opponentMatches
    .slice(0, 5)
    .map((match) => {
      const ourScore = match.ourScore ?? 0;
      const opponentScore = match.opponentScore ?? 0;

      const result: MatchOpponentRecordItem["result"] =
        ourScore > opponentScore
          ? "win"
          : ourScore < opponentScore
            ? "lose"
            : "draw";

      return {
        id: match.id,
        date: match.date,
        ourScore,
        opponentScore,
        result,
      };
    });

  const goalDiff = summary.goals - summary.conceded;
  const winRate =
    summary.totalMatches === 0
      ? 0
      : Math.round((summary.win / summary.totalMatches) * 100);

  return {
    ...summary,
    goalDiff,
    winRate,
    recentMatches,
  };
}

export function getMatchCreateDefaults() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return {
    defaultDate: `${year}-${month}-${day}`,
    defaultStartTime: "20:00",
    defaultEndTime: "22:00",
    defaultLocation: "",
  };
}

export function getMatchDetailTab(value: string | null): MatchDetailTab {
  return value === "info" ||
    value === "vote" ||
    value === "tactics" ||
    value === "record" ||
    value === "review"
    ? value
    : "info";
}
