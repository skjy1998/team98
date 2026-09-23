import type { MatchItem } from "@/types/match";
import type { MatchVotesByMatchId, VoteStatus } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import DashboardUpcomingMatchCard from "./DashboardUpcomingMatchCard";
import Link from "next/link";

interface DashboardUpcomingMatchSectionProps {
  upcomingMatches: MatchItem[];
  votes: MatchVotesByMatchId;
  players: PlayerType[];
  myPlayer?: PlayerType;
  onChangeMyVote: (matchId: string, status: VoteStatus) => Promise<boolean>;
}

export default function DashboardUpcomingMatchSection({
  upcomingMatches,
  votes,
  players,
  myPlayer,
  onChangeMyVote,
}: Readonly<DashboardUpcomingMatchSectionProps>) {
  const nextMatch = upcomingMatches[0];

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-900 sm:text-sm">
          다가오는 경기
        </span>
        <Link
          href="/matches"
          className="text-xs font-medium text-stone-500 transition hover:text-stone-800 sm:text-sm"
        >
          전체 보기
        </Link>
      </div>

      {upcomingMatches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-4 py-6 text-center text-xs text-stone-500 sm:rounded-2xl sm:p-10 sm:text-sm">
          등록된 예정 경기가 없어요.
        </div>
      ) : (
        <DashboardUpcomingMatchCard
          match={nextMatch}
          votes={votes[nextMatch.id] ?? []}
          players={players}
          myPlayer={myPlayer}
          onChangeMyVote={onChangeMyVote}
        />
      )}
    </section>
  );
}
