import type { FeeType } from "@/types/finance";
import FinanceFeeTypeForm from "./FinanceFeeTypeForm";

interface FinanceFeeTypeListProps {
  feeTypes: FeeType[];
  editingFeeTypeId: string | null;
  editingFeeName: string;
  editingFeeDescription: string;
  editingFeeAmount: string;
  onChangeEditingFeeName: (value: string) => void;
  onChangeEditingFeeDescription: (value: string) => void;
  onChangeEditingFeeAmount: (value: string) => void;
  onStartEditFeeType: (feeType: FeeType) => void;
  onSaveEditFeeType: () => void;
  onCancelEditFeeType: () => void;
  onDeleteFeeType: (feeTypeId: string) => void;
}

export default function FinanceFeeTypeList({
  feeTypes,
  editingFeeTypeId,
  editingFeeName,
  editingFeeDescription,
  editingFeeAmount,
  onChangeEditingFeeName,
  onChangeEditingFeeDescription,
  onChangeEditingFeeAmount,
  onStartEditFeeType,
  onSaveEditFeeType,
  onCancelEditFeeType,
  onDeleteFeeType,
}: Readonly<FinanceFeeTypeListProps>) {
  if (feeTypes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-stone-400">
        등록된 회비 유형이 없습니다
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      {feeTypes.map((feeType, index) => {
        const isEditing = editingFeeTypeId === feeType.id;

        return (
          <div key={feeType.id}>
            {isEditing ? (
              <div className="px-5 py-5">
                <FinanceFeeTypeForm
                  feeTypeName={editingFeeName}
                  onChangeFeeTypeName={onChangeEditingFeeName}
                  feeTypeDescription={editingFeeDescription}
                  onChangeFeeTypeDescription={onChangeEditingFeeDescription}
                  feeTypeAmount={editingFeeAmount}
                  onChangeFeeTypeAmount={onChangeEditingFeeAmount}
                  onCancel={onCancelEditFeeType}
                  onSave={onSaveEditFeeType}
                  submitLabel="저장"
                  variant="plain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between px-5 py-5">
                <button
                  type="button"
                  onClick={() => onStartEditFeeType(feeType)}
                  className="text-left"
                >
                  <p className="text-base font-semibold text-stone-900">
                    {feeType.name}{" "}
                    {feeType.description && (
                      <span className="text-stone-400">
                        ({feeType.description})
                      </span>
                    )}
                  </p>
                </button>

                <div className="flex items-center gap-4">
                  <p className="text-3xl font-semibold text-stone-900">
                    {feeType.amount.toLocaleString()}원
                  </p>

                  <button
                    type="button"
                    onClick={() => onDeleteFeeType(feeType.id)}
                    className="text-xl text-stone-400 transition hover:text-stone-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {index < feeTypes.length - 1 && (
              <div className="border-t border-stone-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}
