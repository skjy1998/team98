import type { VoteFilter } from "@/types/match-vote";
import { Search } from "lucide-react";

interface VoteFilterToolbarProps {
  search: string;
  filter: VoteFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: VoteFilter) => void;
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
    activeClassName: "bg-rose-600 text-white",
  },
  {
    value: "unvoted",
    label: "미투표",
    activeClassName: "bg-stone-500 text-white",
  },
];

export default function VoteFilterToolbar({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: Readonly<VoteFilterToolbarProps>) {
  return (
    <>
      <div className="relative mt-4 sm:mt-5">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:left-4"
        />
        <label htmlFor="vote-member-search" className="sr-only">
          선수 이름 검색
        </label>
        <input
          id="vote-member-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="이름 검색"
          className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-10 pr-3 text-sm text-stone-800 outline-none focus:border-emerald-300 sm:h-14 sm:pl-11 sm:pr-4"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
        {filterOptions.map((option) => {
          const isActive = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(option.value)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition sm:rounded-xl sm:px-4 sm:text-sm ${
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
    </>
  );
}
