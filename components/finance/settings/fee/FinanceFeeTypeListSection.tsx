import type { FeeType } from "@/types/finance";
import type { FinanceEditFeeTypeState } from "@/types/finance-ui";
import FinanceFeeTypeList from "./FinanceFeeTypeList";

interface FinanceFeeTypeListSectionProps {
  canManage: boolean;
  feeTypes: FeeType[];
  editState: FinanceEditFeeTypeState;
}

export default function FinanceFeeTypeListSection({
  canManage,
  feeTypes,
  editState,
}: Readonly<FinanceFeeTypeListSectionProps>) {
  return (
    <>
      <p className="mb-2 text-sm font-medium text-stone-500">회비 기준</p>
      <FinanceFeeTypeList
        canManage={canManage}
        feeTypes={feeTypes}
        editState={editState}
      />
    </>
  );
}
