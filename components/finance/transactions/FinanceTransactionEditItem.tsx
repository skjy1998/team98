import type { FinanceTransactionEditState } from "@/types/finance-ui";
import FinanceEntryForm from "./FinanceEntryForm";

interface FinanceTransactionEditItemProps {
  editState: FinanceTransactionEditState;
}

export default function FinanceTransactionEditItem({
  editState,
}: Readonly<FinanceTransactionEditItemProps>) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-sm sm:px-4 sm:py-3">
      <FinanceEntryForm
        entryType={editState.editEntryType}
        onChangeEntryType={editState.onChangeEditEntryType}
        entryAmount={editState.editEntryAmount}
        onChangeEntryAmount={editState.onChangeEditEntryAmount}
        entryDescription={editState.editEntryDescription}
        onChangeEntryDescription={editState.onChangeEditEntryDescription}
        entryDate={editState.editEntryDate}
        onChangeEntryDate={editState.onChangeEditEntryDate}
        entryTime={editState.editEntryTime}
        onChangeEntryTime={editState.onChangeEditEntryTime}
        onSubmit={editState.onSubmitEditEntry}
        onCancel={editState.onCancelEdit}
        submitLabel="거래 수정"
      />
    </div>
  );
}
