import { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { Pencil, Trash2 } from "lucide-react";

interface FinanceTransactionSectionProps {
  search: string;
  onChangeSearch: (value: string) => void;
  entryFilter: "all" | FinanceEntryType;
  onChangeEntryFilter: (value: "all" | FinanceEntryType) => void;
  isEntryFormOpen: boolean;
  onToggleEntryForm: () => void;
  entryType: FinanceEntryType;
  onChangeEntryType: (value: FinanceEntryType) => void;
  entryAmount: string;
  onChangeEntryAmount: (value: string) => void;
  entryDescription: string;
  onChangeEntryDescription: (value: string) => void;
  entryDate: string;
  onChangeEntryDate: (value: string) => void;
  entryTime: string;
  onChangeEntryTime: (value: string) => void;
  editingEntryId: string | null;
  entries: FinanceEntry[];
  onStartEdit: (entry: FinanceEntry) => void;
  onSubmitEntry: () => void;
  onCancelEdit: () => void;
  onDeleteEntry: (entryId: string) => void;
  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
}

export default function FinanceTransactionSection({
  search,
  onChangeSearch,
  entryFilter,
  onChangeEntryFilter,
  isEntryFormOpen,
  onToggleEntryForm,
  entryType,
  onChangeEntryType,
  entryAmount,
  onChangeEntryAmount,
  entryDescription,
  onChangeEntryDescription,
  entryDate,
  onChangeEntryDate,
  entryTime,
  onChangeEntryTime,
  editingEntryId,
  entries,
  onStartEdit,
  onSubmitEntry,
  onCancelEdit,
  onDeleteEntry,
  currentMonthLabel,
  onMoveMonth,
}: Readonly<FinanceTransactionSectionProps>) {
  return (
    <>
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

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={onToggleEntryForm}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-base font-semibold text-stone-900">
            수기 입력
          </span>
          <span className="text-stone-400">{isEntryFormOpen ? "⌃" : "⌄"}</span>
        </button>

        {isEntryFormOpen && (
          <div className="grid gap-3 border-t border-stone-200 px-5 py-5 md:grid-cols-2">
            <select
              value={entryType}
              onChange={(event) =>
                onChangeEntryType(event.target.value as FinanceEntryType)
              }
              className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none focus:border-orange-300"
            >
              <option value="income">입금</option>
              <option value="expense">출금</option>
            </select>
            <input
              value={entryAmount}
              onChange={(event) => onChangeEntryAmount(event.target.value)}
              placeholder="금액"
              type="number"
              className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
            />

            <input
              value={entryDescription}
              onChange={(event) => onChangeEntryDescription(event.target.value)}
              placeholder="내용"
              className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 md:col-span-2"
            />
            <input
              value={entryDate}
              onChange={(event) => onChangeEntryDate(event.target.value)}
              type="date"
              className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
            />
            <input
              value={entryTime}
              onChange={(event) => onChangeEntryTime(event.target.value)}
              type="time"
              className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={onSubmitEntry}
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                거래 추가
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isEditing = editingEntryId === entry.id;

          if (isEditing) {
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-3 shadow-sm"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    value={entryType}
                    onChange={(event) =>
                      onChangeEntryType(event.target.value as FinanceEntryType)
                    }
                    className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none focus:border-orange-300"
                  >
                    <option value="income">입금</option>
                    <option value="expense">출금</option>
                  </select>

                  <input
                    value={entryAmount}
                    onChange={(event) =>
                      onChangeEntryAmount(event.target.value)
                    }
                    placeholder="금액"
                    type="number"
                    className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
                  />

                  <input
                    value={entryDescription}
                    onChange={(event) =>
                      onChangeEntryDescription(event.target.value)
                    }
                    placeholder="내용"
                    className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 md:col-span-2"
                  />

                  <input
                    value={entryDate}
                    onChange={(event) => onChangeEntryDate(event.target.value)}
                    type="date"
                    className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
                  />

                  <input
                    value={entryTime}
                    onChange={(event) => onChangeEntryTime(event.target.value)}
                    type="time"
                    className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
                  />

                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onCancelEdit}
                      className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200"
                    >
                      취소
                    </button>

                    <button
                      type="button"
                      onClick={onSubmitEntry}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      거래 수정
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={entry.id}
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {entry.description}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {entry.date} · {entry.time}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      entry.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {entry.type === "income" ? "입금" : "출금"}
                  </span>

                  <p
                    className={`text-base font-semibold ${
                      entry.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {entry.type === "income" ? "+" : "-"}
                    {entry.amount.toLocaleString()}원
                  </p>

                  <button
                    type="button"
                    onClick={() => onStartEdit(entry)}
                    className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-50 hover:text-stone-700"
                    aria-label="거래 수정"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                    aria-label="거래 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
