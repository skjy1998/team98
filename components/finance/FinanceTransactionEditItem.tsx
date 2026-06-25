import type { FinanceEntryType } from "@/types/finance";
import FinanceEntryForm from "./FinanceEntryForm";

interface FinanceTransactionEditItemProps {
  editEntryType: FinanceEntryType;
  onChangeEditEntryType: (value: FinanceEntryType) => void;
  editEntryAmount: string;
  onChangeEditEntryAmount: (value: string) => void;
  editEntryDescription: string;
  onChangeEditEntryDescription: (value: string) => void;
  editEntryDate: string;
  onChangeEditEntryDate: (value: string) => void;
  editEntryTime: string;
  onChangeEditEntryTime: (value: string) => void;
  onSubmitEditEntry: () => void;
  onCancelEdit: () => void;
}

export default function FinanceTransactionEditItem({
  editEntryType,
  onChangeEditEntryType,
  editEntryAmount,
  onChangeEditEntryAmount,
  editEntryDescription,
  onChangeEditEntryDescription,
  editEntryDate,
  onChangeEditEntryDate,
  editEntryTime,
  onChangeEditEntryTime,
  onSubmitEditEntry,
  onCancelEdit,
}: Readonly<FinanceTransactionEditItemProps>) {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50/40 px-4 py-3 shadow-sm">
      <FinanceEntryForm
        entryType={editEntryType}
        onChangeEntryType={onChangeEditEntryType}
        entryAmount={editEntryAmount}
        onChangeEntryAmount={onChangeEditEntryAmount}
        entryDescription={editEntryDescription}
        onChangeEntryDescription={onChangeEditEntryDescription}
        entryDate={editEntryDate}
        onChangeEntryDate={onChangeEditEntryDate}
        entryTime={editEntryTime}
        onChangeEntryTime={onChangeEditEntryTime}
        onSubmit={onSubmitEditEntry}
        onCancel={onCancelEdit}
        submitLabel="거래 수정"
      />
    </div>
  );
}
