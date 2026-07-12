import { usePlayers } from "@/hooks/players/usePlayers";
import { useMemo, useState } from "react";
import VoteSummaryCard from "./VoteSummaryCard";
import VoteManagementPanel from "./VoteManagementPanel";
import type { VoteFilter, VoteStatus } from "@/types/match-vote";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import {
  getFilteredVoteMembers,
  getVoteMembers,
  getVoteSummary,
} from "@/lib/match-vote";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import MyVoteCard from "./MyVoteCard";
import { MatchItem } from "@/types/match";

interface MatchVoteTabProps {
  matchId: string;
  match: MatchItem;
}

function formatVoteDeadline(date: string, time: string) {
  const parsedDate = new Date(`${date}T${time}`);

  if (Number.isNaN(parsedDate.getTime())) {
    return `${date} ${time}`;
  }

  return parsedDate.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function MatchVoteTab({
  matchId,
  match,
}: Readonly<MatchVoteTabProps>) {
  const { players, playersLoaded } = usePlayers();
  const { votes, votesLoaded, saveVote } = useMatchVotes();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VoteFilter>("all");

  const currentVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);

  const myPlayer = useMemo(
    () => players.find((player) => player.userId === member?.userId),
    [players, member?.userId],
  );

  const voteMembers = useMemo(
    () => getVoteMembers(players, currentVotes),
    [players, currentVotes],
  );

  const filteredMembers = useMemo(
    () => getFilteredVoteMembers(voteMembers, search, filter),
    [voteMembers, search, filter],
  );

  const summary = useMemo(() => getVoteSummary(voteMembers), [voteMembers]);

  const myVoteStatus =
    currentVotes.find((vote) => vote.playerId === myPlayer?.id)?.status ??
    "pending";

  const voteDeadlineText = formatVoteDeadline(match.date, match.startTime);

  const handleChangeStatus = async (playerId: string, status: VoteStatus) => {
    const success = await saveVote(matchId, playerId, status);

    if (!success) {
      globalThis.alert("투표 저장에 실패했어요.");
    }
  };

  if (!playersLoaded || !votesLoaded || !memberLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">투표 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <VoteSummaryCard
        attend={summary.attend}
        pending={summary.pending}
        absent={summary.absent}
        total={summary.total}
      />
      {myPlayer ? (
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
            현재 계정에 연결된 선수 정보가 없어서 개인 투표를 진행할 수 없어요.
          </p>
        </section>
      )}
      <VoteManagementPanel
        title="전체 투표 현황"
        search={search}
        filter={filter}
        members={filteredMembers}
        showFilters={canManage}
        canManage={canManage}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
}
