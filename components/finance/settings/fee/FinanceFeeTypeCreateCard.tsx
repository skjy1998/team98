import type { FinanceCreateFeeTypeState } from "@/types/finance-ui";
import FinanceFeeTypeForm from "./FinanceFeeTypeForm";

interface FinanceFeeTypeCreateCardProps {
  canManage: boolean;
  createState: FinanceCreateFeeTypeState;
}

export default function FinanceFeeTypeCreateCard({
  canManage,
  createState,
}: Readonly<FinanceFeeTypeCreateCardProps>) {
  return (
    <>
      {canManage && createState.isAddingFeeType && (
        <FinanceFeeTypeForm
          feeTypeName={createState.feeTypeName}
          onChangeFeeTypeName={createState.onChangeFeeTypeName}
          feeTypeDescription={createState.feeTypeDescription}
          onChangeFeeTypeDescription={createState.onChangeFeeTypeDescription}
          feeTypeAmount={createState.feeTypeAmount}
          onChangeFeeTypeAmount={(value) =>
            createState.onChangeFeeTypeAmount(Number(value) || 0)
          }
          onCancel={createState.onCancelFeeType}
          onSave={createState.onSaveFeeType}
          isSubmitting={createState.isSubmitting}
          submitLabel="추가"
        />
      )}
      {canManage && (
        <button
          type="button"
          onClick={createState.onOpenAddFeeType}
          disabled={createState.isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-dashed border-emerald-200 bg-emerald-100 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-base"
        >
          + 회비 유형 추가
        </button>
      )}
    </>
  );
}
