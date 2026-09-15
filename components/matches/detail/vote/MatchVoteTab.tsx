import type { MatchVote, VoteFilter, VoteStatus } from "@/types/match-vote";
import type { MatchItem } from "@/types/match";
import type { PlayerType } from "@/types/player";
import { useMemo, useState } from "react";

import {
  formatVoteDeadline,
  getFilteredVoteMembers,
  getPlayerVoteStatus,
  getVoteMembers,
  getVoteSummary,
  isVoteClosed,
} from "@/lib/matches/match-vote";
import MyVoteCard from "./MyVoteCard";
import VoteSummaryCard from "./VoteSummaryCard";
import VoteManagementPanel from "./VoteManagementPanel";
import { useMatchVoteTabActions } from "@/hooks/matches/useMatchVoteTabActions";

interface MatchVoteTabProps {
  matchId: string;
  match: MatchItem;
  players: PlayerType[];
  currentUserId?: string;
  canManage: boolean;
  votes: MatchVote[];
  saveVote: (
    matchId: string,
    playerId: string,
    status: VoteStatus,
  ) => Promise<boolean>;
  deleteVote: (matchId: string, playerId: string) => Promise<boolean>;
}

export default function MatchVoteTab({
  matchId,
  match,
  players,
  currentUserId,
  canManage,
  votes,
  saveVote,
  deleteVote,
}: Readonly<MatchVoteTabProps>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VoteFilter>("all");

  const myPlayer = useMemo(
    () => players.find((player) => player.userId === currentUserId),
    [players, currentUserId],
  );

  const voteMembers = useMemo(
    () => getVoteMembers(players, votes),
    [players, votes],
  );

  const filteredMembers = useMemo(
    () => getFilteredVoteMembers(voteMembers, search, filter),
    [voteMembers, search, filter],
  );

  const summary = useMemo(() => getVoteSummary(voteMembers), [voteMembers]);

  const myVoteStatus = getPlayerVoteStatus(votes, myPlayer?.id);

  const isClosed = isVoteClosed(match.voteDeadline);
  const voteDeadlineText = formatVoteDeadline(match.voteDeadline);

  const { handleChangeStatus } = useMatchVoteTabActions({
    matchId,
    votes,
    saveVote,
    deleteVote,
  });

  return (
    <div className="space-y-5">
      {!isClosed &&
        (myPlayer ? (
          <MyVoteCard
            playerId={myPlayer.id}
            status={myVoteStatus}
            deadlineText={voteDeadlineText}
            onChangeStatus={handleChangeStatus}
          />
        ) : (
          <section className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-stone-900">내 투표</h2>
            <p className="mt-4 text-sm text-stone-500">
              현재 계정에 연결된 선수 정보가 없어서 개인 투표를 진행할 수
              없어요.
            </p>
          </section>
        ))}
      <VoteSummaryCard summary={summary} />
      <VoteManagementPanel
        members={filteredMembers}
        canManage={canManage}
        filterState={{
          search,
          filter,
          onSearchChange: setSearch,
          onFilterChange: setFilter,
        }}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
}
