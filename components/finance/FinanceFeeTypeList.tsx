import { FeeType } from "@/types/finance";

interface FinanceFeeTypeListProps {
  feeTypes: FeeType[];
  editingFeeTypeId: string | null;
  editingFeeAmount: string;
  onChangeEditingFeeAmount: (value: string) => void;
  onStartEditFeeType: (feeTypeId: string, amount: number) => void;
  onSaveEditFeeType: (feeTypeId: string) => void;
  onCancelEditFeeType: () => void;
  onDeleteFeeType: (feeTypeId: string) => void;
}

export default function FinanceFeeTypeList({
  feeTypes,
  editingFeeTypeId,
  editingFeeAmount,
  onChangeEditingFeeAmount,
  onStartEditFeeType,
  onSaveEditFeeType,
  onCancelEditFeeType,
  onDeleteFeeType,
}: Readonly<FinanceFeeTypeListProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      {feeTypes.map((feeType, index) => (
        <div key={feeType.id}>
          <div className="flex items-center justify-between px-5 py-5">
            <div>
              <p className="text-base font-semibold text-stone-900">
                {feeType.name}{" "}
                {feeType.description && (
                  <span className="text-stone-400">
                    ({feeType.description})
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {editingFeeTypeId === feeType.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="number"
                    value={editingFeeAmount}
                    onChange={(event) =>
                      onChangeEditingFeeAmount(event.target.value)
                    }
                    onBlur={() => onSaveEditFeeType(feeType.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        onSaveEditFeeType(feeType.id);
                      }
                      if (event.key === "Escape") {
                        onCancelEditFeeType();
                      }
                    }}
                    className="w-32 rounded-xl border border-stone-200 bg-white px-3 py-2 text-right text-2xl font-semibold text-stone-900 outline-none focus:border-orange-300"
                  />
                  <span className="text-lg font-semibold text-stone-500">
                    원
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartEditFeeType(feeType.id, feeType.amount)}
                  className="text-3xl font-semibold text-stone-900 transition hover:text-orange-500"
                >
                  {feeType.amount.toLocaleString()}원
                </button>
              )}
              <button
                type="button"
                onClick={() => onDeleteFeeType(feeType.id)}
                className="text-xl text-stone-400 transition hover:text-stone-600"
              >
                ×
              </button>
            </div>
          </div>

          {index < feeTypes.length - 1 && (
            <div className="border-t border-stone-100" />
          )}
        </div>
      ))}
    </div>
  );
}
