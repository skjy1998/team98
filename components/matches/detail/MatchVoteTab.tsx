import { usePlayers } from "@/hooks/usePlayers";
import { useMemo, useState } from "react";
import VoteSummaryCard from "./VoteSummaryCard";
import VoteManagementPanel from "./VoteManagementPanel";
import { MatchVote, VoteFilter, VoteStatus } from "@/types/match-vote";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import {
  getFilteredVoteMembers,
  getVoteMembers,
  getVoteSummary,
} from "@/lib/match-vote";

interface MatchVoteTabProps {
  matchId: string;
}

export default function MatchVoteTab({ matchId }: Readonly<MatchVoteTabProps>) {
  const { players } = usePlayers();
  const { votes, setVotes } = useMatchVotes();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VoteFilter>("all");

  const currentVotes = useMemo(() => {
    return votes[matchId] ?? [];
  }, [votes, matchId]);

  const voteMembers = useMemo(
    () => getVoteMembers(players, currentVotes),
    [players, currentVotes],
  );

  const filteredMembers = useMemo(
    () => getFilteredVoteMembers(voteMembers, search, filter),
    [voteMembers, search, filter],
  );

  const summary = useMemo(() => getVoteSummary(voteMembers), [voteMembers]);

  const updateStatus = (playerId: string, status: VoteStatus) => {
    setVotes((prev) => {
      const prevVotes = prev[matchId] ?? [];
      const existing = prevVotes.find((vote) => vote.playerId === playerId);

      let nextVotes: MatchVote[];

      if (existing) {
        nextVotes = prevVotes.map((vote) =>
          vote.playerId === playerId ? { ...vote, status } : vote,
        );
      } else {
        nextVotes = [...prevVotes, { playerId, status }];
      }
      return {
        ...prev,
        [matchId]: nextVotes,
      };
    });
  };

  return (
    <div className="space-y-5">
      <VoteSummaryCard
        attend={summary.attend}
        pending={summary.pending}
        absent={summary.absent}
        total={summary.total}
      />
      <VoteManagementPanel
        search={search}
        filter={filter}
        members={filteredMembers}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onChangeStatus={updateStatus}
      />
    </div>
  );
}
