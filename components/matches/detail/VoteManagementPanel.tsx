import { VoteFilter, VoteMember } from "@/types/match-vote";
import { Search } from "lucide-react";
import VoteMemberRow from "./VoteMemberRow";

type VoteStatus = "attend" | "pending" | "absent";

interface VoteManagementPanelProps {
  search: string;
  filter: "all" | VoteStatus;
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

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="이름 검색"
          className="h-14 w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-11 pr-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            filter === "all"
              ? "bg-emerald-600 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("attend")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            filter === "attend"
              ? "bg-emerald-600 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          참석
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("pending")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            filter === "pending"
              ? "bg-amber-500 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          미정
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("absent")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            filter === "absent"
              ? "bg-rose-500 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          불참
        </button>
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
