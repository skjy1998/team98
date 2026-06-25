import { FinanceEntry, FinanceEntryType } from "@/types/finance";
import FinanceTransactionToolbar from "./FinanceTransactionToolbar";
import FinanceCreateEntryCard from "./FinanceCreateEntryCard";
import FinanceTransactionList from "./FinanceTransactionList";

interface FinanceTransactionSectionProps {
  search: string;
  onChangeSearch: (value: string) => void;
  entryFilter: "all" | FinanceEntryType;
  onChangeEntryFilter: (value: "all" | FinanceEntryType) => void;

  isEntryFormOpen: boolean;
  onToggleEntryForm: () => void;

  createEntryType: FinanceEntryType;
  onChangeCreateEntryType: (value: FinanceEntryType) => void;
  createEntryAmount: string;
  onChangeCreateEntryAmount: (value: string) => void;
  createEntryDescription: string;
  onChangeCreateEntryDescription: (value: string) => void;
  createEntryDate: string;
  onChangeCreateEntryDate: (value: string) => void;
  createEntryTime: string;
  onChangeCreateEntryTime: (value: string) => void;
  onSubmitCreateEntry: () => void;

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

  entries: FinanceEntry[];
  onStartEdit: (entry: FinanceEntry) => void;
  onDeleteEntry: (entryId: string) => void;

  currentMonthLabel: string;
  onMoveMonth: (direction: "prev" | "next") => void;
}

export default function FinanceTransactionSection({
  search,
  onChangeSearch,
  entryFilter,
  onChangeEntryFilter,
  isEntryFormOpen,
  onToggleEntryForm,

  createEntryType,
  onChangeCreateEntryType,
  createEntryAmount,
  onChangeCreateEntryAmount,
  createEntryDescription,
  onChangeCreateEntryDescription,
  createEntryDate,
  onChangeCreateEntryDate,
  createEntryTime,
  onChangeCreateEntryTime,
  onSubmitCreateEntry,

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

  entries,
  onStartEdit,
  onDeleteEntry,
  currentMonthLabel,
  onMoveMonth,
}: Readonly<FinanceTransactionSectionProps>) {
  return (
    <>
      <FinanceTransactionToolbar
        currentMonthLabel={currentMonthLabel}
        onMoveMonth={onMoveMonth}
        search={search}
        onChangeSearch={onChangeSearch}
        entryFilter={entryFilter}
        onChangeEntryFilter={onChangeEntryFilter}
      />
      <FinanceCreateEntryCard
        isOpen={isEntryFormOpen}
        onToggle={onToggleEntryForm}
        createEntryType={createEntryType}
        onChangeCreateEntryType={onChangeCreateEntryType}
        createEntryAmount={createEntryAmount}
        onChangeCreateEntryAmount={onChangeCreateEntryAmount}
        createEntryDescription={createEntryDescription}
        onChangeCreateEntryDescription={onChangeCreateEntryDescription}
        createEntryDate={createEntryDate}
        onChangeCreateEntryDate={onChangeCreateEntryDate}
        createEntryTime={createEntryTime}
        onChangeCreateEntryTime={onChangeCreateEntryTime}
        onSubmitCreateEntry={onSubmitCreateEntry}
      />
      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
          <p className="text-sm text-stone-500">이번 달 거래 내역이 없어요.</p>
        </div>
      ) : (
        <FinanceTransactionList
          entries={entries}
          editingEntryId={editingEntryId}
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
          onStartEdit={onStartEdit}
          onDeleteEntry={onDeleteEntry}
        />
      )}
    </>
  );
}
