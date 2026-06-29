import type { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { useState } from "react";

interface UseFinanceTransactionsParams {
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
}: UseFinanceTransactionsParams) {
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [createEntryType, setCreateEntryType] =
    useState<FinanceEntryType>("income");
  const [createEntryAmount, setCreateEntryAmount] = useState("");
  const [createEntryDescription, setCreateEntryDescription] = useState("");
  const [createEntryDate, setCreateEntryDate] = useState(defaultDate);
  const [createEntryTime, setCreateEntryTime] = useState(defaultTime);

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editEntryType, setEditEntryType] =
    useState<FinanceEntryType>("income");
  const [editEntryAmount, setEditEntryAmount] = useState("");
  const [editEntryDescription, setEditEntryDescription] = useState("");
  const [editEntryDate, setEditEntryDate] = useState(defaultDate);
  const [editEntryTime, setEditEntryTime] = useState(defaultTime);

  const [search, setSearch] = useState("");

  const [entryFilter, setEntryFilter] = useState<"all" | FinanceEntryType>(
    "all",
  );

  const resetCreateForm = () => {
    setCreateEntryType("income");
    setCreateEntryAmount("");
    setCreateEntryDescription("");
    setCreateEntryDate(defaultDate);
    setCreateEntryTime(defaultTime);
  };

  const handleSubmitCreateEntry = () => {
    if (
      !createEntryDescription.trim() ||
      !createEntryAmount.trim() ||
      Number(createEntryAmount) <= 0
    ) {
      return;
    }

    addEntry({
      type: createEntryType,
      amount: Number(createEntryAmount),
      description: createEntryDescription.trim(),
      date: createEntryDate,
      time: createEntryTime,
    });

    resetCreateForm();
    setIsEntryFormOpen(false);
  };

  const resetEditForm = () => {
    setEditingEntryId(null);
    setEditEntryType("income");
    setEditEntryAmount("");
    setEditEntryDescription("");
    setEditEntryDate(defaultDate);
    setEditEntryTime(defaultTime);
  };

  const handleStartEdit = (entry: FinanceEntry) => {
    setIsEntryFormOpen(false);
    setEditingEntryId(entry.id);
    setEditEntryType(entry.type);
    setEditEntryAmount(String(entry.amount));
    setEditEntryDescription(entry.description);
    setEditEntryDate(entry.date);
    setEditEntryTime(entry.time);
  };

  const handleSubmitEditEntry = () => {
    if (!editingEntryId) return;

    if (
      !editEntryDescription.trim() ||
      !editEntryAmount.trim() ||
      Number(editEntryAmount) <= 0
    ) {
      return;
    }

    updateEntry(editingEntryId, {
      type: editEntryType,
      amount: Number(editEntryAmount),
      description: editEntryDescription.trim(),
      date: editEntryDate,
      time: editEntryTime,
    });

    resetEditForm();
  };

  const handleCancelEdit = () => {
    resetEditForm();
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
    search,
    entryFilter,
    filteredEntries,
    editingEntryId,

    createEntryType,
    createEntryAmount,
    createEntryDescription,
    createEntryDate,
    createEntryTime,

    editEntryType,
    editEntryAmount,
    editEntryDescription,
    editEntryDate,
    editEntryTime,

    setSearch,
    setEntryFilter,
    setCreateEntryType,
    setCreateEntryAmount,
    setCreateEntryDescription,
    setCreateEntryDate,
    setCreateEntryTime,
    setEditEntryType,
    setEditEntryAmount,
    setEditEntryDescription,
    setEditEntryDate,
    setEditEntryTime,

    handleToggleEntryForm,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteEntry,
    handleSubmitCreateEntry,
    handleSubmitEditEntry,
  };
}
