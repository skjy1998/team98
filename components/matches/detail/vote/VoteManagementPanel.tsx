import type { VoteFilter, VoteMember, VoteStatus } from "@/types/match-vote";
import VoteMemberRow from "./VoteMemberRow";
import VoteFilterToolbar from "./VoteFilterToolbar";

interface VoteManagementFilterState {
  search: string;
  filter: VoteFilter;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: VoteFilter) => void;
}

interface VoteManagementPanelProps {
  title: string;
  members: VoteMember[];
  canManage: boolean;
  filterState: VoteManagementFilterState;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

export default function VoteManagementPanel({
  title,
  members,
  canManage,
  filterState,
  onChangeStatus,
}: Readonly<VoteManagementPanelProps>) {
  const { search, filter, showFilters, onSearchChange, onFilterChange } =
    filterState;

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
      {showFilters && (
        <VoteFilterToolbar
          search={search}
          filter={filter}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
        />
      )}
      {!canManage && (
        <p className="mt-4 text-sm text-stone-500">
          전체 명단은 조회만 가능하고, 내 투표는 위 카드에서 변경할 수 있어요.
        </p>
      )}
      <div className="mt-5 space-y-3">
        {members.map((member) => (
          <VoteMemberRow
            key={member.id}
            id={member.id}
            name={member.name}
            status={member.status}
            canEdit={canManage}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>
    </section>
  );
}
