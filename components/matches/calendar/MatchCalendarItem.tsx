import { getMatchResult } from "@/lib/matches/match-display";
import type { MatchItem } from "@/types/match";
import Link from "next/link";

interface MatchCalendarItemProps {
  match: MatchItem;
}

const resultBadgeClassNames = {
  win: "bg-emerald-100 text-emerald-700",
  draw: "bg-amber-100 text-amber-700",
  lose: "bg-rose-100 text-rose-700",
} as const;

const resultLabels = {
  win: "승",
  draw: "무",
  lose: "패",
} as const;

function MatchCalendarScore({ match }: Readonly<MatchCalendarItemProps>) {
  const result = getMatchResult(match);
  const hasScore =
    match.ourScore !== undefined && match.opponentScore !== undefined;

  if (result === "canceled") {
    return (
      <span className="text-[11px] font-medium text-stone-400">경기 취소</span>
    );
  }

  if (!hasScore) {
    return (
      <span className="text-[11px] font-medium text-stone-400">
        {match.playersPerSide} vs {match.playersPerSide} · 경기 전
      </span>
    );
  }

  if (match.type === "자체전") {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold">
        <span className="text-emerald-700">A</span>
        <span className="text-stone-900">{match.ourScore}</span>
        <span className="text-stone-300">:</span>
        <span className="text-stone-900">{match.opponentScore}</span>
        <span className="text-sky-700">B</span>
      </div>
    );
  }

  if (result !== "win" && result !== "draw" && result !== "lose") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-[11px] font-bold">
        <span className="text-stone-900">{match.ourScore}</span>
        <span className="text-stone-400">:</span>
        <span className="text-stone-900">{match.opponentScore}</span>
      </div>

      <span
        className={[
          "inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold",
          resultBadgeClassNames[result],
        ].join(" ")}
      >
        {resultLabels[result]}
      </span>
    </div>
  );
}

export default function MatchCalendarItem({
  match,
}: Readonly<MatchCalendarItemProps>) {
  return (
    <Link
      href={`/matches/${match.id}`}
      className={[
        "group block rounded-lg px-1.5 py-1 text-stone-700 transition hover:bg-white/70",
        match.status === "canceled" ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[11px] font-bold text-stone-900">
          {match.startTime}
        </span>

        <span
          className={[
            "truncate text-xs font-semibold",
            match.status === "canceled" ? "line-through" : "",
          ].join(" ")}
        >
          {match.title}
        </span>
      </div>

      <p className="mt-0.5 truncate text-[11px] text-stone-500">
        {match.location || "장소 미정"}
      </p>

      <div className="mt-1">
        <MatchCalendarScore match={match} />
      </div>
    </Link>
  );
}
