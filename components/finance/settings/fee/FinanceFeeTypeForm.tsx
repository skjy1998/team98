interface FinanceFeeTypeFormProps {
  feeTypeName: string;
  onChangeFeeTypeName: (value: string) => void;
  feeTypeDescription: string;
  onChangeFeeTypeDescription: (value: string) => void;
  feeTypeAmount: string | number;
  onChangeFeeTypeAmount: (value: string) => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  variant?: "card" | "plain";
}

export default function FinanceFeeTypeForm({
  feeTypeName,
  onChangeFeeTypeName,
  feeTypeDescription,
  onChangeFeeTypeDescription,
  feeTypeAmount,
  onChangeFeeTypeAmount,
  onCancel,
  onSave,
  isSubmitting,
  submitLabel,
  variant = "card",
}: Readonly<FinanceFeeTypeFormProps>) {
  const containerClassName =
    variant === "card"
      ? "rounded-xl border border-emerald-200 bg-emerald-50/30 p-3.5 bg-white shadow-sm sm:px-5 sm:py-5"
      : "";

  return (
    <div className={containerClassName}>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            유형명
          </p>
          <input
            autoFocus
            value={feeTypeName}
            onChange={(event) => onChangeFeeTypeName(event.target.value)}
            placeholder="예: 일반"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:text-base"
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            금액
          </p>
          <input
            type="number"
            value={feeTypeAmount}
            onChange={(event) => onChangeFeeTypeAmount(event.target.value)}
            placeholder="30000"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            설명
          </p>
          <input
            value={feeTypeDescription}
            onChange={(event) => onChangeFeeTypeDescription(event.target.value)}
            placeholder="예: 월 회비"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:text-base"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2 sm:mt-5 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3 sm:text-base"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-stone-300 sm:py-3 sm:text-base"
        >
          {isSubmitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
