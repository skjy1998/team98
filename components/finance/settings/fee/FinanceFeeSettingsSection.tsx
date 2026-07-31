import type { FeeType } from "@/types/finance";
import type {
  FinanceCreateFeeTypeState,
  FinanceDueDayState,
  FinanceEditFeeTypeState,
} from "@/types/finance-ui";
import FinanceDueDayCard from "../FinanceDueDayCard";
import FinanceFeeTypeCreateCard from "./FinanceFeeTypeCreateCard";
import FinanceFeeTypeListSection from "./FinanceFeeTypeListSection";

interface FinanceFeeSettingsSectionProps {
  canManage: boolean;
  dueDayState: FinanceDueDayState;
  createFeeTypeState: FinanceCreateFeeTypeState;
  feeTypes: FeeType[];
  editFeeTypeState: FinanceEditFeeTypeState;
}

export default function FinanceFeeSettingsSection({
  canManage,
  dueDayState,
  createFeeTypeState,
  feeTypes,
  editFeeTypeState,
}: Readonly<FinanceFeeSettingsSectionProps>) {
  return (
    <section className="space-y-4">
      <p className="text-lg font-semibold text-stone-900">회비 설정</p>
      <div className="space-y-4">
        <FinanceDueDayCard
          canManage={canManage}
          dueDay={dueDayState.dueDay}
          onChangeDueDay={dueDayState.onChangeDueDay}
        />

        <FinanceFeeTypeListSection
          canManage={canManage}
          feeTypes={feeTypes}
          editState={editFeeTypeState}
        />
        <FinanceFeeTypeCreateCard
          canManage={canManage}
          createState={createFeeTypeState}
        />
      </div>
    </section>
  );
}
