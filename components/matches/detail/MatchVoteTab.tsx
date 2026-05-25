import { usePlayers } from "@/hooks/usePlayers";
import { useEffect, useMemo, useState } from "react";
import VoteSummaryCard from "./VoteSummaryCard";
import VoteManagementPanel from "./VoteManagementPanel";
import {
  MatchVote,
  MatchVotesByMatchId,
  VoteFilter,
  VoteStatus,
} from "@/types/match-vote";

interface MatchVoteTabProps {
  matchId: string;
}

export default function MatchVoteTab({ matchId }: Readonly<MatchVoteTabProps>) {
  const { players } = usePlayers();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VoteFilter>("all");
  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);

  const currentVotes = useMemo(() => {
    return votes[matchId] ?? [];
  }, [votes, matchId]);

  const voteMembers = useMemo(() => {
    return players.map((player) => {
      const vote = currentVotes.find((item) => item.playerId === player.id);

      return {
        id: player.id,
        name: player.name,
        status: vote?.status ?? "pending",
      };
    });
  }, [players, currentVotes]);

  const filteredMembers = useMemo(() => {
    return voteMembers.filter((member) => {
      const matchSearch = member.name.includes(search);
      const matchFilter = filter === "all" ? true : member.status === filter;
      return matchSearch && matchFilter;
    });
  }, [voteMembers, search, filter]);

  const summary = useMemo(() => {
    const attend = voteMembers.filter((m) => m.status === "attend").length;
    const pending = voteMembers.filter((m) => m.status === "pending").length;
    const absent = voteMembers.filter((m) => m.status === "absent").length;

    return {
      attend,
      pending,
      absent,
      total: voteMembers.length,
    };
  }, [voteMembers]);

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
  useEffect(() => {
    const saved = localStorage.getItem("match-votes");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVotes(JSON.parse(saved));
    }

    setVotesLoaded(true);
  }, []);
  useEffect(() => {
    if (!votesLoaded) return;

    localStorage.setItem("match-votes", JSON.stringify(votes));
  }, [votes, votesLoaded]);

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
