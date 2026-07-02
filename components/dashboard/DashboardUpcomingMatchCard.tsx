import { getOpponentName } from "@/lib/match-ui";
import { MatchItem } from "@/types/match";
import { MatchVote } from "@/types/match-vote";
import { Clock3, MapPin } from "lucide-react";
import Link from "next/link";

interface DashboardUpcomingMatchCardProps {
  match: MatchItem;
  votes: MatchVote[];
  totalPlayers: number;
}

const weekLabels = ["일", "월", "화", "수", "목", "금", "토"] as const;

function getDDay(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function getDateParts(date: string) {
  const target = new Date(date);

  return {
    month: target.getMonth() + 1,
    day: target.getDate(),
    dayOfWeek: `${weekLabels[target.getDay()]}요일`,
  };
}

function getVoteSummary(votes: MatchVote[], totalPlayers: number) {
  const attendCount = votes.filter((vote) => vote.status === "attend").length;
  const absentCount = votes.filter((vote) => vote.status === "absent").length;
  const pendingCount = Math.max(totalPlayers - attendCount - absentCount, 0);
  const respondedCount = attendCount + absentCount;

  const attendRate =
    totalPlayers > 0 ? Math.round((attendCount / totalPlayers) * 100) : 0;

  return {
    attendCount,
    absentCount,
    pendingCount,
    respondedCount,
    attendRate,
  };
}

export default function DashboardUpcomingMatchCard({
  match,
  votes,
  totalPlayers,
}: Readonly<DashboardUpcomingMatchCardProps>) {
  const dDay = getDDay(match.date);
  const { month, day, dayOfWeek } = getDateParts(match.date);
  const { attendCount, absentCount, pendingCount, respondedCount, attendRate } =
    getVoteSummary(votes, totalPlayers);

  const attendWidth = totalPlayers > 0 ? (attendCount / totalPlayers) * 100 : 0;
  const pendingWidth =
    totalPlayers > 0 ? (pendingCount / totalPlayers) * 100 : 0;
  const absentWidth = totalPlayers > 0 ? (absentCount / totalPlayers) * 100 : 0;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-2xl border border-orange-200 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.10),_transparent_28%),linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
          {match.type}
        </span>

        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-500">
          {dDay}
        </span>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[100px_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center text-center md:border-r md:border-stone-200 md:pr-5">
          <p className="text-base font-semibold text-stone-400">{month}월</p>
          <p className="mt-1 text-6xl font-black leading-none text-stone-900">
            {day}
          </p>
          <p className="mt-2 text-base font-semibold text-stone-500">
            {dayOfWeek}
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[0.1em] text-orange-400">
              VS
            </span>
            <span className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
              {getOpponentName(match)}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-stone-500">
            <div className="flex items-center gap-2 text-base font-semibold text-stone-700">
              <Clock3 className="h-4 w-4 text-stone-400" />
              <span>{match.startTime}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-stone-400" />
              <span>{match.location || "장소 미정"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm font-extrabold text-emerald-500">
            참석 {attendRate}%
          </span>
          <span className="text-sm font-semibold text-stone-500">
            {respondedCount}/{totalPlayers}명 응답
          </span>
        </div>

        <div className="mt-4 flex h-6 overflow-hidden rounded bg-stone-100">
          <div
            className="flex items-center justify-center bg-emerald-400 text-sm font-bold text-white"
            style={{ width: `${attendWidth}%` }}
          >
            {attendCount > 0 ? attendCount : ""}
          </div>
          <div
            className="flex items-center justify-center bg-amber-300 text-sm font-bold text-white"
            style={{ width: `${pendingWidth}%` }}
          >
            {pendingCount > 0 ? pendingCount : ""}
          </div>
          <div
            className="flex items-center justify-center bg-rose-400 text-sm font-bold text-white"
            style={{ width: `${absentWidth}%` }}
          >
            {absentCount > 0 ? absentCount : ""}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            참석 {attendCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            미정 {pendingCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            불참 {absentCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
