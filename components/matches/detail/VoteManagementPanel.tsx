import type { VoteFilter, VoteMember, VoteStatus } from "@/types/match-vote";
import { Search } from "lucide-react";
import VoteMemberRow from "./VoteMemberRow";

interface VoteManagementPanelProps {
  search: string;
  filter: VoteFilter;
  members: VoteMember[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: VoteFilter) => void;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

const filterOptions: {
  value: VoteFilter;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "all",
    label: "전체",
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "attend",
    label: "참석",
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "pending",
    label: "미정",
    activeClassName: "bg-amber-500 text-white",
  },
  {
    value: "absent",
    label: "불참",
    activeClassName: "bg-rose-500 text-white",
  },
];

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

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="이름 검색"
          className="h-14 w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-11 pr-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onFilterChange(option.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                isActive
                  ? option.activeClassName
                  : "border border-stone-200 bg-white text-stone-600"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

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
