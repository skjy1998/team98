import {
  getDashboardMatchDateParts,
  getDashboardMatchDDay,
} from "@/lib/dashboard/dashboard-ui";
import { getOpponentName } from "@/lib/matches/match-ui";
import {
  formatVoteDeadline,
  getPlayerVoteStatus,
  getVoteMembers,
  getVoteSummary,
  isVoteClosed,
} from "@/lib/matches/match-vote";
import type { MatchItem } from "@/types/match";
import type { MatchVote, VoteStatus } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import { Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import DashboardMyVoteButtons from "./DashboardMyVoteButtons";
import DashboardVoteSummary from "./DashboardVoteSummary";

interface DashboardUpcomingMatchCardProps {
  match: MatchItem;
  votes: MatchVote[];
  players: PlayerType[];
  myPlayer?: PlayerType;
  onChangeMyVote: (matchId: string, status: VoteStatus) => Promise<boolean>;
}

export default function DashboardUpcomingMatchCard({
  match,
  votes,
  players,
  myPlayer,
  onChangeMyVote,
}: Readonly<DashboardUpcomingMatchCardProps>) {
  const dDay = getDashboardMatchDDay(match.date);
  const { month, day, dayOfWeek } = getDashboardMatchDateParts(match.date);
  const voteClosed = isVoteClosed(match.voteDeadline);
  const voteDeadlineText = formatVoteDeadline(match.voteDeadline);
  const voteMembers = getVoteMembers(players, votes);
  const voteSummary = getVoteSummary(voteMembers);

  const myVoteStatus = getPlayerVoteStatus(votes, myPlayer?.id);

  return (
    <article className="relative rounded-2xl border border-orange-200 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.10),_transparent_28%),linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-5 shadow-sm">
      <Link
        href={`/matches/${match.id}`}
        aria-label={`${getOpponentName(match)} 경기 상세 보기`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
      />
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
          <p className="mt-1 text-5xl font-bold leading-none text-stone-900">
            {day}
          </p>
          <p className="mt-2 text-base font-semibold text-stone-500">
            {dayOfWeek}
          </p>
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-[0.1em] text-orange-400">
              {match.type === "정규" ? "상대팀" : "경기"}
            </p>
            <p className="text-3xl font-semibold tracking-tight text-stone-900">
              {getOpponentName(match)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-base font-semibold text-stone-700">
            <Clock3 className="h-4 w-4 shrink-0 text-stone-400" />
            <span>
              {match.startTime} - {match.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-500">
            <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
            <span>{match.location || "장소 미정"}</span>
          </div>
        </div>
      </div>

      <DashboardVoteSummary summary={voteSummary} />
      {voteClosed ? (
        <div className="mt-5 border-t border-dashed border-stone-200 pt-5">
          <p className="text-sm font-semibold text-stone-500">
            투표가 마감됐어요.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            마감: {voteDeadlineText}
          </p>
        </div>
      ) : myPlayer ? (
        <div className="relative z-10">
          <DashboardMyVoteButtons
            matchId={match.id}
            status={myVoteStatus}
            deadlineText={voteDeadlineText}
            onChangeStatus={onChangeMyVote}
          />
        </div>
      ) : (
        <div className="mt-5 border-t border-dashed border-stone-200 pt-5">
          <p className="text-sm text-stone-500">
            계정에 연결된 선수 정보가 없어 투표할 수 없어요.
          </p>
        </div>
      )}
    </article>
  );
}
