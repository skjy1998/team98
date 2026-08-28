import { formatFinanceEntryDescription } from "@/lib/finance/finance-fine";
import type { FinanceEntry } from "@/types/finance";
import { Pencil, Trash2 } from "lucide-react";

interface FinanceTransactionItemProps {
  entry: FinanceEntry;
  onStartEdit: (entry: FinanceEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  canManage: boolean;
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-900">
            {formatFinanceEntryDescription(entry.description)}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {entry.date} · {entry.time}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClassName}`}
          >
            {typeLabel}
          </span>

          <p className={`text-base font-semibold ${amountClassName}`}>
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
