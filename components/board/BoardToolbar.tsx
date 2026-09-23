import type { BoardPostFilter } from "@/types/board";
import { PenLine, Search } from "lucide-react";

interface BoardToolbarProps {
  search: string;
  filter: BoardPostFilter;
  onChangeSearch: (value: string) => void;
  onChangeFilter: (value: BoardPostFilter) => void;
  onOpenCreate: () => void;
}

const filters: Array<{
  value: BoardPostFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "notice", label: "공지" },
  { value: "general", label: "일반" },
];

export default function BoardToolbar({
  search,
  filter,
  onChangeSearch,
  onChangeFilter,
  onOpenCreate,
}: Readonly<BoardToolbarProps>) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={search}
          onChange={(event) => onChangeSearch(event.target.value)}
          placeholder="제목, 내용 또는 작성자 검색"
          className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
        />
      </div>

      <div className="flex gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChangeFilter(item.value)}
            className={[
              "h-10 flex-1 rounded-xl px-2 text-xs font-semibold transition sm:h-11 sm:flex-none sm:px-4 sm:text-sm",
              filter === item.value
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex h-10 shrink-0 whitespace-nowrap items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:h-11 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <PenLine className="h-4 w-4" />
          글쓰기
        </button>
      </div>
    </div>
  );
}
