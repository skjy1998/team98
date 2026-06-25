import { FeeType, FineRule } from "@/types/finance";
import { useState } from "react";
import FinanceFeeSettingsSection from "./FinanceFeeSettingsSection";
import FinanceFineRuleSection from "./FinanceFineRulesSection";

interface FinanceSettingsSectionProps {
  dueDay: string;
  feeTypes: FeeType[];
  fineRules: FineRule[];
  onChangeDueDay: (value: string) => void;
  onAddFeeType: (nextFeeType: FeeType) => void;
  onUpdateFeeType: (feeTypeId: string, updates: Partial<FeeType>) => void;
  onDeleteFeeType: (feeTypeId: string) => void;
  onAddFineRule: (nextFineRule: FineRule) => void;
  onUpdateFineRule: (fineRuleId: string, updates: Partial<FineRule>) => void;
  onDeleteFineRule: (fineRuleId: string) => void;
}

export default function FinanceSettingsSection({
  dueDay,
  feeTypes,
  fineRules,
  onChangeDueDay,
  onAddFeeType,
  onUpdateFeeType,
  onDeleteFeeType,
  onAddFineRule,
  onUpdateFineRule,
  onDeleteFineRule,
}: Readonly<FinanceSettingsSectionProps>) {
  const [isAddingFeeType, setIsAddingFeeType] = useState(false);
  const [feeTypeName, setFeeTypeName] = useState("");
  const [feeTypeDescription, setFeeTypeDescription] = useState("");
  const [feeTypeAmount, setFeeTypeAmount] = useState(30000);

  const [isAddingFineRule, setIsAddingFineRule] = useState(false);
  const [fineRuleName, setFineRuleName] = useState("");
  const [fineRuleTrigger, setFineRuleTrigger] = useState("late");
  const [fineRuleAmount, setFineRuleAmount] = useState(5000);

  const [editingFeeTypeId, setEditingFeeTypeId] = useState<string | null>(null);
  const [editingFeeAmount, setEditingFeeAmount] = useState("");

  const fineTriggerLabel: Record<string, string> = {
    late: "지각",
    absence: "무단 결석",
    noshow: "미투표",
  };

  const handleCancelFeeType = () => {
    setIsAddingFeeType(false);
    setFeeTypeName("");
    setFeeTypeDescription("");
    setFeeTypeAmount(30000);
  };

  const handleSaveFeeType = () => {
    if (!feeTypeName.trim() || feeTypeAmount <= 0) {
      return;
    }

    onAddFeeType({
      id: crypto.randomUUID(),
      name: feeTypeName.trim(),
      description: feeTypeDescription,
      amount: feeTypeAmount,
    });

    handleCancelFeeType();
  };

  const handleDeleteFeeType = (feeTypeId: string) => {
    onDeleteFeeType(feeTypeId);
  };

  const handleCancelFineRule = () => {
    setIsAddingFineRule(false);
    setFineRuleName("");
    setFineRuleTrigger("late");
    setFineRuleAmount(5000);
  };

  const handleStartEditFeeType = (feeTypeId: string, amount: number) => {
    setEditingFeeTypeId(feeTypeId);
    setEditingFeeAmount(String(amount));
  };

  const handleCancelEditFeeType = () => {
    setEditingFeeTypeId(null);
    setEditingFeeAmount("");
  };

  const handleSaveEditFeeType = (feeTypeId: string) => {
    const nextAmount = Number(editingFeeAmount);

    if (nextAmount <= 0) {
      return;
    }

    onUpdateFeeType(feeTypeId, { amount: nextAmount });

    handleCancelEditFeeType();
  };

  const handleSaveFineRule = () => {
    if (!fineRuleName.trim() || fineRuleAmount <= 0) {
      return;
    }

    onAddFineRule({
      id: crypto.randomUUID(),
      name: fineRuleName.trim(),
      trigger: fineRuleTrigger,
      amount: fineRuleAmount,
    });

    handleCancelFineRule();
  };

  const handleDeleteFineRule = (ruleId: string) => {
    onDeleteFineRule(ruleId);
  };

  return (
    <div className="space-y-8">
      <FinanceFeeSettingsSection
        dueDay={dueDay}
        onChangeDueDay={onChangeDueDay}
        isAddingFeeType={isAddingFeeType}
        onOpenAddFeeType={() => setIsAddingFeeType(true)}
        feeTypeName={feeTypeName}
        onChangeFeeTypeName={setFeeTypeName}
        feeTypeDescription={feeTypeDescription}
        onChangeFeeTypeDescription={setFeeTypeDescription}
        feeTypeAmount={feeTypeAmount}
        onChangeFeeTypeAmount={setFeeTypeAmount}
        onCancelFeeType={handleCancelFeeType}
        onSaveFeeType={handleSaveFeeType}
        feeTypes={feeTypes}
        editingFeeTypeId={editingFeeTypeId}
        editingFeeAmount={editingFeeAmount}
        onChangeEditingFeeAmount={setEditingFeeAmount}
        onStartEditFeeType={handleStartEditFeeType}
        onSaveEditFeeType={handleSaveEditFeeType}
        onCancelEditFeeType={handleCancelEditFeeType}
        onDeleteFeeType={handleDeleteFeeType}
      />

      <FinanceFineRuleSection
        fineRules={fineRules}
        fineTriggerLabel={fineTriggerLabel}
        isAddingFineRule={isAddingFineRule}
        onOpenAddFineRule={() => setIsAddingFineRule(true)}
        fineRuleName={fineRuleName}
        onChangeFineRuleName={setFineRuleName}
        fineRuleTrigger={fineRuleTrigger}
        onChangeFineRuleTrigger={setFineRuleTrigger}
        fineRuleAmount={fineRuleAmount}
        onChangeFineRuleAmount={setFineRuleAmount}
        onCancelFineRule={handleCancelFineRule}
        onSaveFineRule={handleSaveFineRule}
        onDeleteFineRule={handleDeleteFineRule}
      />
    </div>
  );
}
