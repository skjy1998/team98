import { FinanceEntryType } from "@/types/finance";

interface FinanceTransactionToolbarProps {
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
  search: string;
  onChangeSearch: (value: string) => void;
  entryFilter: "all" | FinanceEntryType;
  onChangeEntryFilter: (value: "all" | FinanceEntryType) => void;
}

export default function FinanceTransactionToolbar({
  currentMonthLabel,
  onMoveMonth,
  search,
  onChangeSearch,
  entryFilter,
  onChangeEntryFilter,
}: Readonly<FinanceTransactionToolbarProps>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onMoveMonth("prev")}
          className="rounded-lg px-3 py-2 text-stone-500 transition hover:bg-stone-50"
        >
          &lt;
        </button>

        <p className="min-w-24 text-center text-2xl font-semibold text-stone-900">
          {currentMonthLabel}
        </p>

        <button
          type="button"
          onClick={() => onMoveMonth("next")}
          className="rounded-lg px-3 py-2 text-stone-500 transition hover:bg-stone-50"
        >
          &gt;
        </button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <input
          value={search}
          onChange={(event) => onChangeSearch(event.target.value)}
          placeholder="이름 또는 항목 검색"
          className="h-11 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
        />

        <div className="flex gap-3">
          <select
            value={entryFilter}
            onChange={(event) =>
              onChangeEntryFilter(
                event.target.value as "all" | FinanceEntryType,
              )
            }
            className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none focus:border-orange-300"
          >
            <option value="all">전체</option>
            <option value="income">입금</option>
            <option value="expense">출금</option>
          </select>
          <button
            type="button"
            className="h-11 rounded-xl bg-stone-100 px-4 text-sm font-medium text-stone-600 transition hover:bg-stone-200"
          >
            편집
          </button>
        </div>
      </div>
    </div>
  );
}
