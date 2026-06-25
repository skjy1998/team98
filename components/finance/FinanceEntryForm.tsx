import type { FinanceEntryType } from "@/types/finance";

interface FinanceEntryFormProps {
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
  onSubmit: () => void;
  submitLabel: string;
  onCancel?: () => void;
  className?: string;
}

export default function FinanceEntryForm({
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
  onSubmit,
  submitLabel,
  onCancel,
  className,
}: Readonly<FinanceEntryFormProps>) {
  return (
    <div className={className}>
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

        <div className="md:col-span-2 flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200"
            >
              취소
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
