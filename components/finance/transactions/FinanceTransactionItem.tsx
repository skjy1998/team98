import { formatFinanceEntryDescription } from "@/lib/finance/finance-fine";
import type { FinanceEntry } from "@/types/finance";
import { Pencil, Trash2 } from "lucide-react";

interface FinanceTransactionItemProps {
  entry: FinanceEntry;
  onStartEdit: (entry: FinanceEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  canManage: boolean;
}

function formatFinanceEntryDate(date: string) {
  const [, month, day] = date.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

export default function FinanceTransactionItem({
  entry,
  onStartEdit,
  onDeleteEntry,
  canManage,
}: Readonly<FinanceTransactionItemProps>) {
  const isIncome = entry.type === "income";
  const typeLabel = isIncome ? "입금" : "출금";
  const badgeClassName = isIncome
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-600";
  const amountClassName = isIncome ? "text-emerald-600" : "text-rose-500";
  const amountPrefix = isIncome ? "+" : "-";
  const isManualEntry = !entry.category || entry.category === "etc";
  const canEditEntry = canManage && isManualEntry;

  return (
    <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">
            {formatFinanceEntryDescription(entry.description)}
          </p>
          <p className="mt-0.5 text-xs text-stone-400">
            {formatFinanceEntryDate(entry.date)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${badgeClassName}`}
          >
            {typeLabel}
          </span>

          <p
            className={`whitespace-nowrap text-base font-semibold sm:text-lg ${amountClassName}`}
          >
            {amountPrefix}
            {entry.amount.toLocaleString()}원
          </p>

          {canEditEntry && (
            <button
              type="button"
              onClick={() => onStartEdit(entry)}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-50 hover:text-stone-700"
              aria-label="거래 수정"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {canEditEntry && (
            <button
              type="button"
              onClick={() => onDeleteEntry(entry.id)}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
              aria-label="거래 삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
