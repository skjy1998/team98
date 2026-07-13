import type { FinanceEntry, FinanceEntryType } from "@/types/finance";
import FinanceTransactionEditItem from "./FinanceTransactionEditItem";
import FinanceTransactionItem from "./FinanceTransactionItem";

interface FinanceTransactionListProps {
  canManage: boolean;
  entries: FinanceEntry[];
  editingEntryId: string | null;

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

  onStartEdit: (entry: FinanceEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function FinanceTransactionList({
  canManage,
  entries,
  editingEntryId,
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
  onStartEdit,
  onDeleteEntry,
}: Readonly<FinanceTransactionListProps>) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isEditing = editingEntryId === entry.id;
        if (isEditing) {
          return (
            <FinanceTransactionEditItem
              key={entry.id}
              editEntryType={editEntryType}
              onChangeEditEntryType={onChangeEditEntryType}
              editEntryAmount={editEntryAmount}
              onChangeEditEntryAmount={onChangeEditEntryAmount}
              editEntryDescription={editEntryDescription}
              onChangeEditEntryDescription={onChangeEditEntryDescription}
              editEntryDate={editEntryDate}
              onChangeEditEntryDate={onChangeEditEntryDate}
              editEntryTime={editEntryTime}
              onChangeEditEntryTime={onChangeEditEntryTime}
              onSubmitEditEntry={onSubmitEditEntry}
              onCancelEdit={onCancelEdit}
            />
          );
        }

        return (
          <FinanceTransactionItem
            key={entry.id}
            entry={entry}
            onStartEdit={onStartEdit}
            onDeleteEntry={onDeleteEntry}
            canManage={canManage}
          />
        );
      })}
    </div>
  );
}
