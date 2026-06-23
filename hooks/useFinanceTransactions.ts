import { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { useState } from "react";

interface UseFinanceTransactionParams {
  entries: FinanceEntry[];
  currentMonth: string;
  defaultDate: string;
  defaultTime: string;
  addEntry: (entry: Omit<FinanceEntry, "id">) => void;
  updateEntry: (entryId: string, updates: Omit<FinanceEntry, "id">) => void;
  deleteEntry: (entryId: string) => void;
}

export function useFinanceTransactions({
  entries,
  currentMonth,
  defaultDate,
  defaultTime,
  addEntry,
  updateEntry,
  deleteEntry,
}: UseFinanceTransactionParams) {
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [entryType, setEntryType] = useState<FinanceEntryType>("income");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [entryDate, setEntryDate] = useState(defaultDate);
  const [entryTime, setEntryTime] = useState(defaultTime);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [entryFilter, setEntryFilter] = useState<"all" | FinanceEntryType>(
    "all",
  );

  const handleSubmitEntry = () => {
    if (
      !entryDescription.trim() ||
      !entryAmount.trim() ||
      Number(entryAmount) <= 0
    ) {
      return;
    }

    if (editingEntryId) {
      updateEntry(editingEntryId, {
        type: entryType,
        amount: Number(entryAmount),
        description: entryDescription.trim(),
        date: entryDate,
        time: entryTime,
      });

      handleCancelEdit();
      return;
    }

    addEntry({
      type: entryType,
      amount: Number(entryAmount),
      description: entryDescription.trim(),
      date: entryDate,
      time: entryTime,
    });

    handleCancelEdit();
    setIsEntryFormOpen(false);
  };

  const handleStartEdit = (entry: FinanceEntry) => {
    setEditingEntryId(entry.id);
    setEntryType(entry.type);
    setEntryAmount(String(entry.amount));
    setEntryDescription(entry.description);
    setEntryDate(entry.date);
    setEntryTime(entry.time);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEntryType("income");
    setEntryAmount("");
    setEntryDescription("");
    setEntryDate(defaultDate);
    setEntryTime(defaultTime);
    setIsEntryFormOpen(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    const confirmed = globalThis.confirm("이 내역을 삭제할까요?");
    if (!confirmed) return;

    deleteEntry(entryId);
  };

  const handleToggleEntryForm = () => {
    setEditingEntryId(null);
    setIsEntryFormOpen((prev) => !prev);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesMonth = entry.date.startsWith(currentMonth);
    const matchesSearch = entry.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = entryFilter === "all" || entry.type === entryFilter;

    return matchesMonth && matchesSearch && matchesFilter;
  });

  return {
    isEntryFormOpen,
    entryType,
    entryAmount,
    entryDescription,
    entryDate,
    entryTime,
    editingEntryId,
    search,
    entryFilter,
    filteredEntries,
    setEntryType,
    setEntryAmount,
    setEntryDescription,
    setEntryDate,
    setEntryTime,
    setSearch,
    setEntryFilter,
    handleSubmitEntry,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteEntry,
    handleToggleEntryForm,
  };
}
