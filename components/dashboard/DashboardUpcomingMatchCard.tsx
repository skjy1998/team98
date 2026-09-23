import {
  getDashboardMatchDateParts,
  getDashboardMatchDDay,
} from "@/lib/dashboard/dashboard-ui";
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
import { getOpponentName } from "@/lib/matches/match-display";

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
    <article className="relative rounded-xl border border-emerald-200 bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.12),_transparent_28%),linear-gradient(180deg,#f8fffb_0%,#ffffff_100%)] p-3.5 shadow-sm sm:rounded-2xl sm:p-5">
      <Link
        href={`/matches/${match.id}`}
        aria-label={`${getOpponentName(match)} 경기 상세 보기`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 sm:rounded-xl sm:px-3 sm:text-sm">
          {match.type}
        </span>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-500 sm:px-3 sm:text-sm">
          {dDay}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[68px_minmax(0,1fr)] gap-3 sm:mt-5 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-5">
        <div className="flex flex-col items-center justify-center border-r border-stone-200 pr-3 text-center sm:pr-5">
          <p className="text-xs font-semibold text-stone-400 sm:text-base">
            {month}월
          </p>
          <p className="mt-1 text-3xl font-bold leading-none text-stone-900 sm:text-5xl">
            {day}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-stone-500 sm:mt-2 sm:text-base">
            {dayOfWeek}
          </p>
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.1em] text-emerald-500 sm:text-sm">
              {match.type === "정규" ? "상대팀" : "경기"}
            </p>
            <p className="text-xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {getOpponentName(match)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-stone-700 sm:text-base">
            <Clock3 className="h-4 w-4 shrink-0 text-stone-400" />
            <span>
              {match.startTime} - {match.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 sm:text-sm">
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
