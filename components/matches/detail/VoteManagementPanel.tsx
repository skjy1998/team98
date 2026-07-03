import type { VoteFilter, VoteMember, VoteStatus } from "@/types/match-vote";
import VoteMemberRow from "./VoteMemberRow";
import VoteFilterToolbar from "./VoteFilterToolbar";

interface VoteManagementPanelProps {
  search: string;
  filter: VoteFilter;
  members: VoteMember[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: VoteFilter) => void;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

export default function VoteManagementPanel({
  search,
  filter,
  members,
  onSearchChange,
  onFilterChange,
  onChangeStatus,
}: Readonly<VoteManagementPanelProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">투표 관리</h2>
      <VoteFilterToolbar
        search={search}
        filter={filter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />

      <div className="mt-5 space-y-3">
        {members.map((member) => (
          <VoteMemberRow
            key={member.id}
            id={member.id}
            name={member.name}
            status={member.status}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>
    </section>
  );
}
