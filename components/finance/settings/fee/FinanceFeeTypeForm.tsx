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
      ? "rounded-xl border border-orange-200 bg-white px-5 py-5 shadow-sm"
      : "";

  return (
    <div className={containerClassName}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">유형명</p>
          <input
            autoFocus
            value={feeTypeName}
            onChange={(event) => onChangeFeeTypeName(event.target.value)}
            placeholder="예: 일반"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">금액</p>
          <input
            type="number"
            value={feeTypeAmount}
            onChange={(event) => onChangeFeeTypeAmount(event.target.value)}
            placeholder="30000"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-stone-500">설명</p>
          <input
            value={feeTypeDescription}
            onChange={(event) => onChangeFeeTypeDescription(event.target.value)}
            placeholder="예: 월 회비"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSubmitting ? "저장 중..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
