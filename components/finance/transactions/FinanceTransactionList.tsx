import FinanceTransactionItem from "./FinanceTransactionItem";
import FinanceTransactionEditItem from "./FinanceTransactionEditItem";
import type {
  FinanceTransactionEditState,
  FinanceTransactionListState,
} from "@/types/finance-ui";

interface FinanceTransactionListProps {
  canManage: boolean;
  editState: FinanceTransactionEditState;
  listState: FinanceTransactionListState;
}

export default function FinanceTransactionList({
  canManage,
  editState,
  listState,
}: Readonly<FinanceTransactionListProps>) {
  return (
    <div className="space-y-3">
      {listState.entries.map((entry) => {
        const isEditing = editState.editingEntryId === entry.id;
        if (isEditing) {
          return (
            <FinanceTransactionEditItem key={entry.id} editState={editState} />
          );
        }

        return (
          <FinanceTransactionItem
            key={entry.id}
            entry={entry}
            onStartEdit={listState.onStartEdit}
            onDeleteEntry={listState.onDeleteEntry}
            canManage={canManage}
          />
        );
      })}
    </div>
  );
}
