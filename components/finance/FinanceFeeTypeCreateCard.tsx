import { FinanceCreateFeeTypeState } from "@/types/finance-ui";
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
          submitLabel="추가"
        />
      )}
      {canManage && (
        <button
          type="button"
          onClick={createState.onOpenAddFeeType}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100"
        >
          + 회비 유형 추가
        </button>
      )}
    </>
  );
}
