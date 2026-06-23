import { PlayerSortType } from "@/types/player";
import { Search } from "lucide-react";

interface PlayerToolbarProps {
  search: string;
  totalCount: number;
  sortType: PlayerSortType;
  onSearchChange: (value: string) => void;
  onChangeSortType: (value: PlayerSortType) => void;
  onOpen: () => void;
}

export default function PlayerToolbar({
  search,
  totalCount,
  sortType,
  onSearchChange,
  onChangeSortType,
  onOpen,
}: Readonly<PlayerToolbarProps>) {
  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 md:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          placeholder="선수 이름으로 검색"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-14 w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-300 focus:bg-white"
        />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              전체
            </span>
            <span>총 {totalCount}명</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="h-11 rounded-full border border-emerald-200 bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          선수 추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChangeSortType("latest")}
          className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition ${
            sortType === "latest"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          최신순
        </button>

        <button
          type="button"
          onClick={() => onChangeSortType("number")}
          className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition ${
            sortType === "number"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          번호순
        </button>

        <button
          type="button"
          onClick={() => onChangeSortType("name")}
          className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition ${
            sortType === "name"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          가나다순
        </button>
        <button
          type="button"
          onClick={() => onChangeSortType("position")}
          className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition ${
            sortType === "position"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          포지션순
        </button>
      </div>
    </div>
  );
}
