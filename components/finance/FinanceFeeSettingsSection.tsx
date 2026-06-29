import type { FeeType } from "@/types/finance";
import FinanceFeeTypeCreateForm from "./FinanceFeeTypeCreateForm";
import FinanceFeeTypeList from "./FinanceFeeTypeList";

interface FinanceFeeSettingsSectionProps {
  dueDay: string;
  onChangeDueDay: (value: string) => void;

  isAddingFeeType: boolean;
  onOpenAddFeeType: () => void;

  feeTypeName: string;
  onChangeFeeTypeName: (value: string) => void;
  feeTypeDescription: string;
  onChangeFeeTypeDescription: (value: string) => void;
  feeTypeAmount: number;
  onChangeFeeTypeAmount: (value: number) => void;
  onCancelFeeType: () => void;
  onSaveFeeType: () => void;

  feeTypes: FeeType[];
  editingFeeTypeId: string | null;
  editingFeeAmount: string;
  onChangeEditingFeeAmount: (value: string) => void;
  onStartEditFeeType: (feeTypeId: string, amount: number) => void;
  onSaveEditFeeType: (feeTypeId: string) => void;
  onCancelEditFeeType: () => void;
  onDeleteFeeType: (feeTypeId: string) => void;
}

export default function FinanceFeeSettingsSection({
  dueDay,
  onChangeDueDay,
  isAddingFeeType,
  onOpenAddFeeType,
  feeTypeName,
  onChangeFeeTypeName,
  feeTypeDescription,
  onChangeFeeTypeDescription,
  feeTypeAmount,
  onChangeFeeTypeAmount,
  onCancelFeeType,
  onSaveFeeType,
  feeTypes,
  editingFeeTypeId,
  editingFeeAmount,
  onChangeEditingFeeAmount,
  onStartEditFeeType,
  onSaveEditFeeType,
  onCancelEditFeeType,
  onDeleteFeeType,
}: Readonly<FinanceFeeSettingsSectionProps>) {
  return (
    <section className="space-y-4">
      <p className="text-lg font-semibold text-stone-900">회비 설정</p>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">납부 기준일</p>
          <select
            value={dueDay}
            onChange={(event) => onChangeDueDay(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-semibold text-stone-900 outline-none focus:border-orange-300"
          >
            {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
              <option key={day} value={String(day)}>
                매월 {day}일
              </option>
            ))}
          </select>
        </div>

        <p className="mb-2 text-sm font-medium text-stone-500">회비 기준</p>

        {isAddingFeeType && (
          <FinanceFeeTypeCreateForm
            feeTypeName={feeTypeName}
            onChangeFeeTypeName={onChangeFeeTypeName}
            feeTypeDescription={feeTypeDescription}
            onChangeFeeTypeDescription={onChangeFeeTypeDescription}
            feeTypeAmount={feeTypeAmount}
            onChangeFeeTypeAmount={onChangeFeeTypeAmount}
            onCancel={onCancelFeeType}
            onSave={onSaveFeeType}
          />
        )}
        <FinanceFeeTypeList
          feeTypes={feeTypes}
          editingFeeTypeId={editingFeeTypeId}
          editingFeeAmount={editingFeeAmount}
          onChangeEditingFeeAmount={onChangeEditingFeeAmount}
          onStartEditFeeType={onStartEditFeeType}
          onSaveEditFeeType={onSaveEditFeeType}
          onCancelEditFeeType={onCancelEditFeeType}
          onDeleteFeeType={onDeleteFeeType}
        />
      </div>
      <button
        type="button"
        onClick={onOpenAddFeeType}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 text-base font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100"
      >
        + 회비 유형 추가
      </button>
    </section>
  );
}
