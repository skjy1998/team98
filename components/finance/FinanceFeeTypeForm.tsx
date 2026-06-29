interface FinanceFeeTypeFormProps {
  feeTypeName: string;
  onChangeFeeTypeName: (value: string) => void;
  feeTypeDescription: string;
  onChangeFeeTypeDescription: (value: string) => void;
  feeTypeAmount: string | number;
  onChangeFeeTypeAmount: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
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
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">금액</p>
          <input
            type="number"
            value={feeTypeAmount}
            onChange={(event) => onChangeFeeTypeAmount(event.target.value)}
            placeholder="30000"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-stone-500">설명</p>
          <input
            value={feeTypeDescription}
            onChange={(event) => onChangeFeeTypeDescription(event.target.value)}
            placeholder="예: 월 회비"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
