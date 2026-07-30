import type { FeeType, FineRule } from "@/types/finance";
import FinanceFeeSettingsSection from "./FinanceFeeSettingsSection";
import FinanceFineRuleSection from "./FinanceFineRuleSection";
import FinanceReadonlyNotice from "./FinanceReadonlyNotice";
import { useFinanceFeeSettingsState } from "@/hooks/useFinanceFeeSettingsState";
import { useFinanceFineRuleState } from "@/hooks/useFinanceFineRuleState";

interface FinanceSettingsSectionProps {
  canManage: boolean;
  dueDay: string;
  feeTypes: FeeType[];
  fineRules: FineRule[];
  onChangeDueDay: (value: string) => void;
  onAddFeeType: (nextFeeType: FeeType) => void;
  onUpdateFeeType: (feeTypeId: string, updates: Partial<FeeType>) => void;
  onDeleteFeeType: (feeTypeId: string) => void;
  onAddFineRule: (nextFineRule: FineRule) => Promise<boolean>;
  onDeleteFineRule: (fineRuleId: string) => void;
}

const fineTriggerLabel: Record<string, string> = {
  late: "지각",
  absence: "무단 결석",
  noshow: "미투표",
  etc: "기타",
};

export default function FinanceSettingsSection({
  canManage,
  dueDay,
  feeTypes,
  fineRules,
  onChangeDueDay,
  onAddFeeType,
  onUpdateFeeType,
  onDeleteFeeType,
  onAddFineRule,
  onDeleteFineRule,
}: Readonly<FinanceSettingsSectionProps>) {
  const feeSettings = useFinanceFeeSettingsState({
    onAddFeeType,
    onUpdateFeeType,
    onDeleteFeeType,
  });

  const fineRuleSettings = useFinanceFineRuleState({
    onAddFineRule,
    onDeleteFineRule,
  });

  const dueDayState = {
    dueDay,
    onChangeDueDay,
  };

  const createFeeTypeState = {
    isAddingFeeType: feeSettings.isAddingFeeType,
    onOpenAddFeeType: () => {
      feeSettings.handleCancelEditFeeType();
      feeSettings.setIsAddingFeeType(true);
    },
    feeTypeName: feeSettings.feeTypeName,
    onChangeFeeTypeName: feeSettings.setFeeTypeName,
    feeTypeDescription: feeSettings.feeTypeDescription,
    onChangeFeeTypeDescription: feeSettings.setFeeTypeDescription,
    feeTypeAmount: feeSettings.feeTypeAmount,
    onChangeFeeTypeAmount: feeSettings.setFeeTypeAmount,
    onCancelFeeType: feeSettings.handleCancelFeeType,
    onSaveFeeType: feeSettings.handleSaveFeeType,
  };

  const editFeeTypeState = {
    editingFeeTypeId: feeSettings.editingFeeTypeId,
    editingFeeName: feeSettings.editingFeeName,
    editingFeeDescription: feeSettings.editingFeeDescription,
    editingFeeAmount: feeSettings.editingFeeAmount,
    onChangeEditingFeeName: feeSettings.setEditingFeeName,
    onChangeEditingFeeDescription: feeSettings.setEditingFeeDescription,
    onChangeEditingFeeAmount: feeSettings.setEditingFeeAmount,
    onStartEditFeeType: feeSettings.handleStartEditFeeType,
    onSaveEditFeeType: feeSettings.handleSaveEditFeeType,
    onCancelEditFeeType: feeSettings.handleCancelEditFeeType,
    onDeleteFeeType: feeSettings.handleDeleteFeeType,
  };

  const createFineRuleState = {
    isAddingFineRule: fineRuleSettings.isAddingFineRule,
    onOpenAddFineRule: () => fineRuleSettings.setIsAddingFineRule(true),
    fineRuleName: fineRuleSettings.fineRuleName,
    onChangeFineRuleName: fineRuleSettings.setFineRuleName,
    fineRuleTrigger: fineRuleSettings.fineRuleTrigger,
    onChangeFineRuleTrigger: fineRuleSettings.setFineRuleTrigger,
    fineRuleAmount: fineRuleSettings.fineRuleAmount,
    onChangeFineRuleAmount: fineRuleSettings.setFineRuleAmount,
    onCancelFineRule: fineRuleSettings.handleCancelFineRule,
    onSaveFineRule: fineRuleSettings.handleSaveFineRule,
  };

  const fineRuleListState = {
    fineRules,
    fineTriggerLabel,
    onDeleteFineRule: fineRuleSettings.handleDeleteFineRule,
  };

  return (
    <div className="space-y-8">
      {!canManage && (
        <FinanceReadonlyNotice message="회비 설정과 벌금 규칙은 조회할 수 있고, 수정은 운영진만 할 수 있어요." />
      )}
      <FinanceFeeSettingsSection
        canManage={canManage}
        dueDayState={dueDayState}
        createFeeTypeState={createFeeTypeState}
        feeTypes={feeTypes}
        editFeeTypeState={editFeeTypeState}
      />
      <FinanceFineRuleSection
        canManage={canManage}
        createState={createFineRuleState}
        listState={fineRuleListState}
      />
    </div>
  );
}
