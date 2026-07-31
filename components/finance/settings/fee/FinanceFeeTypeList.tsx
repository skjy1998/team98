import type { FeeType } from "@/types/finance";
import FinanceFeeTypeForm from "./FinanceFeeTypeForm";
import type { FinanceEditFeeTypeState } from "@/types/finance-ui";

interface FinanceFeeTypeListProps {
  canManage: boolean;
  feeTypes: FeeType[];
  editState: FinanceEditFeeTypeState;
}

export default function FinanceFeeTypeList({
  canManage,
  feeTypes,
  editState,
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
        const isEditing = editState.editingFeeTypeId === feeType.id;

        return (
          <div key={feeType.id}>
            {isEditing && canManage ? (
              <div className="px-5 py-5">
                <FinanceFeeTypeForm
                  feeTypeName={editState.editingFeeName}
                  onChangeFeeTypeName={editState.onChangeEditingFeeName}
                  feeTypeDescription={editState.editingFeeDescription}
                  onChangeFeeTypeDescription={
                    editState.onChangeEditingFeeDescription
                  }
                  feeTypeAmount={editState.editingFeeAmount}
                  onChangeFeeTypeAmount={editState.onChangeEditingFeeAmount}
                  onCancel={editState.onCancelEditFeeType}
                  onSave={editState.onSaveEditFeeType}
                  isSubmitting={editState.isSubmitting}
                  submitLabel="저장"
                  variant="plain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between px-5 py-5">
                {canManage ? (
                  <button
                    type="button"
                    onClick={() => editState.onStartEditFeeType(feeType)}
                    disabled={editState.isSubmitting}
                    className="text-left disabled:cursor-not-allowed disabled:opacity-60"
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
                ) : (
                  <div className="text-left">
                    <p className="text-base font-semibold text-stone-900">
                      {feeType.name}{" "}
                      {feeType.description && (
                        <span className="text-stone-400">
                          ({feeType.description})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-semibold text-stone-900">
                    {feeType.amount.toLocaleString()}원
                  </p>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => editState.onDeleteFeeType(feeType.id)}
                      disabled={editState.isSubmitting}
                      className="text-xl text-stone-400 transition hover:text-stone-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      ×
                    </button>
                  )}
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
