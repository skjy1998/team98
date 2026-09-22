import type { FinanceEntryFilter } from "@/types/finance";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

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

const entryFilterOptions: {
  value: FinanceEntryFilter;
  label: string;
}[] = [
  { value: "all", label: "전체" },
  { value: "income", label: "입금" },
  { value: "expense", label: "출금" },
];

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const selectedFilterLabel =
    entryFilterOptions.find((option) => option.value === entryFilter)?.label ??
    "전체";

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={() => onMoveMonth("prev")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-50 sm:h-10 sm:w-10"
          aria-label="이전 달"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="min-w-[108px] text-center text-xl font-semibold text-stone-900 sm:min-w-[120px] sm:text-2xl">
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

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:left-4" />
          <input
            value={search}
            onChange={(event) => onChangeSearch(event.target.value)}
            placeholder="검색"
            className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 sm:h-11 sm:pl-11 sm:pr-4"
          />
        </div>

        <div className="w-[84px] shrink-0 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex h-10 w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-2 text-sm text-stone-700 transition hover:border-emerald-200"
            aria-haspopup="dialog"
            aria-expanded={isMobileFilterOpen}
          >
            <span>{selectedFilterLabel}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 text-stone-800"
            />
          </button>
        </div>
        <div className="relative hidden shrink-0 md:block">
          <select
            value={entryFilter}
            onChange={(event) =>
              onChangeEntryFilter(event.target.value as FinanceEntryFilter)
            }
            className="h-11 appearance-none rounded-xl border border-stone-200 bg-white px-4 pr-10 text-sm text-stone-700 outline-none focus:border-emerald-300"
          >
            {entryFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          />
        </div>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <button
              type="button"
              aria-label="필터 선택 닫기"
              className="absolute inset-0 bg-stone-900/30"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-stone-900">
                  거래 유형 선택
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {entryFilterOptions.map((option) => {
                  const isSelected = entryFilter === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChangeEntryFilter(option.value);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {option.label}
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {canManage && (
          <button
            type="button"
            onClick={onToggleEntryForm}
            className={`h-10 shrink-0 rounded-xl px-3 text-sm font-medium transition sm:h-11 sm:px-4 ${
              isEntryFormOpen
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isEntryFormOpen ? "닫기" : "추가"}
          </button>
        )}
      </div>
    </div>
  );
}
