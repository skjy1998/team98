import type { VoteFilter, VoteMember, VoteStatus } from "@/types/match-vote";
import VoteMemberRow from "./VoteMemberRow";
import VoteFilterToolbar from "./VoteFilterToolbar";

interface VoteManagementFilterState {
  search: string;
  filter: VoteFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: VoteFilter) => void;
}

interface VoteManagementPanelProps {
  members: VoteMember[];
  canManage: boolean;
  filterState: VoteManagementFilterState;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

export default function VoteManagementPanel({
  members,
  canManage,
  filterState,
  onChangeStatus,
}: Readonly<VoteManagementPanelProps>) {
  const { search, filter, onSearchChange, onFilterChange } = filterState;

  const hasActiveFilter = search.trim() !== "" || filter !== "all";

  const emptyMessage = hasActiveFilter
    ? "검색 또는 필터 조건에 맞는 선수가 없어요."
    : "표시할 선수가 없어요.";

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">전체 투표 현황</h2>
      {canManage && (
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
      {members.length > 0 ? (
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
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-stone-500">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
