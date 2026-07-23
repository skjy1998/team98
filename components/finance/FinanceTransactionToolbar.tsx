import type { FinanceEntryFilter } from "@/types/finance";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface FinanceTransactionToolbarProps {
  canManage: boolean;
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
  search: string;
  onChangeSearch: (value: string) => void;
  entryFilter: FinanceEntryFilter;
  onChangeEntryFilter: (value: FinanceEntryFilter) => void;
  isEntryFormOpen: boolean;
  onToggleEntryForm: () => void;
}

export default function FinanceTransactionToolbar({
  canManage,
  currentMonthLabel,
  onMoveMonth,
  search,
  onChangeSearch,
  entryFilter,
  onChangeEntryFilter,
  isEntryFormOpen,
  onToggleEntryForm,
}: Readonly<FinanceTransactionToolbarProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onMoveMonth("prev")}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="min-w-[120px] text-center text-2xl font-semibold text-stone-900">
          {currentMonthLabel}
        </p>

        <button
          type="button"
          onClick={() => onMoveMonth("next")}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50"
          aria-label="다음 달"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(event) => onChangeSearch(event.target.value)}
            placeholder="이름 또는 항목 검색"
            className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={entryFilter}
            onChange={(event) =>
              onChangeEntryFilter(event.target.value as FinanceEntryFilter)
            }
            className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none focus:border-orange-300"
          >
            <option value="all">전체</option>
            <option value="income">입금</option>
            <option value="expense">출금</option>
          </select>
          {canManage && (
            <button
              type="button"
              onClick={onToggleEntryForm}
              className={`h-11 rounded-xl px-4 text-sm font-medium transition ${
                isEntryFormOpen
                  ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {isEntryFormOpen ? "입력 닫기" : "거래 추가"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
