import type { FinanceEntryFormProps } from "@/types/finance";

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
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <fieldset className="flex h-11 rounded-xl border border-stone-200 bg-stone-50 p-1">
          <legend className="sr-only">거래 유형</legend>

          {(
            [
              { value: "income", label: "입금" },
              { value: "expense", label: "출금" },
            ] as const
          ).map((option) => {
            const isSelected = entryType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeEntryType(option.value)}
                className={`flex-1 rounded-lg text-sm font-medium transition ${
                  isSelected
                    ? option.value === "income"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-rose-500 text-white shadow-sm"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </fieldset>

        <input
          value={entryAmount}
          onChange={(event) => onChangeEntryAmount(event.target.value)}
          placeholder="금액"
          type="number"
          className="h-11 min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300"
        />

        <input
          value={entryDescription}
          onChange={(event) => onChangeEntryDescription(event.target.value)}
          placeholder="내용"
          className="h-11 col-span-2 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 md:col-span-2"
        />

        <input
          value={entryDate}
          onChange={(event) => onChangeEntryDate(event.target.value)}
          type="date"
          className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />

        <input
          value={entryTime}
          onChange={(event) => onChangeEntryTime(event.target.value)}
          type="time"
          className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />

        <div
          className={`col-span-2 gap-2 ${
            onCancel
              ? "grid grid-cols-2 sm:flex sm:justify-end"
              : "flex justify-end"
          }`}
        >
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200 sm:w-auto"
            >
              취소
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
