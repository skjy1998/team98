import { usePlayers } from "@/hooks/players/usePlayers";
import { useMemo, useState } from "react";
import type { MatchVote, VoteFilter, VoteStatus } from "@/types/match-vote";
import {
  formatVoteDeadline,
  getFilteredVoteMembers,
  getPlayerVoteStatus,
  getVoteMembers,
  getVoteSummary,
  isVoteClosed,
} from "@/lib/matches/match-vote";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import MyVoteCard from "./MyVoteCard";
import type { MatchItem } from "@/types/match";
import VoteSummaryCard from "./VoteSummaryCard";
import VoteManagementPanel from "./VoteManagementPanel";
import ContentState from "@/components/common/ContentState";
import { useToastStore } from "@/stores/toast-store";

interface MatchVoteTabProps {
  matchId: string;
  match: MatchItem;
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
  votes,
  saveVote,
  deleteVote,
}: Readonly<MatchVoteTabProps>) {
  const showToast = useToastStore((state) => state.showToast);

  const { players, playersLoaded } = usePlayers();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VoteFilter>("all");

  const myPlayer = useMemo(
    () => players.find((player) => player.userId === member?.userId),
    [players, member?.userId],
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

  const handleChangeStatus = async (playerId: string, status: VoteStatus) => {
    const currentStatus = getPlayerVoteStatus(votes, playerId);

    const success =
      currentStatus === status
        ? await deleteVote(matchId, playerId)
        : await saveVote(matchId, playerId, status);

    if (!success) {
      showToast("투표 저장에 실패했어요.", "error");
    }
  };

  if (!playersLoaded || !memberLoaded) {
    return (
      <ContentState
        variant="loading"
        title="투표 정보를 불러오는 중..."
        description="참석 여부와 투표 현황을 준비하고 있어요."
      />
    );
  }

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
      <VoteSummaryCard
        attend={summary.attend}
        pending={summary.pending}
        absent={summary.absent}
        unvoted={summary.unvoted}
        total={summary.total}
      />
      <VoteManagementPanel
        title="전체 투표 현황"
        members={filteredMembers}
        canManage={canManage}
        filterState={{
          search,
          filter,
          showFilters: canManage,
          onSearchChange: setSearch,
          onFilterChange: setFilter,
        }}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
}
