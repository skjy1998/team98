import type { FeeType } from "@/types/finance";
import FinanceFeeTypeForm from "./FinanceFeeTypeForm";
import type { FinanceEditFeeTypeState } from "@/types/finance-ui";
import { Trash2 } from "lucide-react";

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
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-xs text-stone-400 sm:px-5 sm:py-10 sm:text-sm">
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
              <div className="px-3.5 py-3.5 sm:px-5 sm:py-5">
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
              <div className="flex items-center justify-between gap-3 px-3.5 py-3 sm:px-5 sm:py-4">
                {canManage ? (
                  <button
                    type="button"
                    onClick={() => editState.onStartEditFeeType(feeType)}
                    disabled={editState.isSubmitting}
                    className="text-left disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <p className="truncate text-sm font-semibold text-stone-900 sm:text-base">
                      {feeType.name}{" "}
                      {feeType.description && (
                        <span className="text-xs font-medium text-stone-400 sm:text-sm">
                          ({feeType.description})
                        </span>
                      )}
                    </p>
                  </button>
                ) : (
                  <div className="text-left">
                    <p className="truncate text-sm font-semibold text-stone-900 sm:text-base">
                      {feeType.name}{" "}
                      {feeType.description && (
                        <span className="text-xs font-medium text-stone-400 sm:text-sm">
                          ({feeType.description})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                  <p className="text-lg font-semibold text-stone-900 sm:text-2xl">
                    {feeType.amount.toLocaleString()}원
                  </p>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => editState.onDeleteFeeType(feeType.id)}
                      disabled={editState.isSubmitting}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`${feeType.name} 회비 유형 삭제`}
                    >
                      <Trash2 className="h-4 w-4" />
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
