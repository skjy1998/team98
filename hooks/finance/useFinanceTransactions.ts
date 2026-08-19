import { useToastStore } from "@/stores/toast-store";
import type { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { useState } from "react";

interface UseFinanceTransactionsParams {
  entries: FinanceEntry[];
  currentMonth: string;
  defaultDate: string;
  defaultTime: string;
  addEntry: (entry: Omit<FinanceEntry, "id">) => Promise<boolean>;
  updateEntry: (
    entryId: string,
    updates: Omit<FinanceEntry, "id">,
  ) => Promise<boolean>;
  deleteEntry: (entryId: string) => Promise<boolean>;
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
  const showToast = useToastStore((state) => state.showToast);

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

  const handleSubmitCreateEntry = async () => {
    if (
      !createEntryDescription.trim() ||
      !createEntryAmount.trim() ||
      Number(createEntryAmount) <= 0
    ) {
      showToast("내용과 올바른 금액을 입력해 주세요.", "info");
      return;
    }

    const success = await addEntry({
      type: createEntryType,
      amount: Number(createEntryAmount),
      description: createEntryDescription.trim(),
      date: createEntryDate,
      time: createEntryTime,
    });

    if (!success) {
      showToast("거래 내역 저장에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 추가했어요.", "success");
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
    if (entry.category && entry.category !== "etc") {
      showToast("회비와 벌금 내역은 해당 관리 탭에서 변경해 주세요.", "info");

      return;
    }

    setIsEntryFormOpen(false);
    setEditingEntryId(entry.id);
    setEditEntryType(entry.type);
    setEditEntryAmount(String(entry.amount));
    setEditEntryDescription(entry.description);
    setEditEntryDate(entry.date);
    setEditEntryTime(entry.time);
  };

  const handleSubmitEditEntry = async () => {
    if (!editingEntryId) return;

    if (
      !editEntryDescription.trim() ||
      !editEntryAmount.trim() ||
      Number(editEntryAmount) <= 0
    ) {
      showToast("내용과 올바른 금액을 입력해 주세요.", "info");
      return;
    }

    const success = await updateEntry(editingEntryId, {
      type: editEntryType,
      amount: Number(editEntryAmount),
      description: editEntryDescription.trim(),
      date: editEntryDate,
      time: editEntryTime,
    });

    if (!success) {
      showToast("거래 내역 수정에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 수정했어요.", "success");
    resetEditForm();
  };

  const handleCancelEdit = () => {
    resetEditForm();
  };

  const handleDeleteEntry = async (entryId: string) => {
    const targetEntry = entries.find((entry) => entry.id === entryId);

    if (!targetEntry) return;

    if (targetEntry.category && targetEntry.category !== "etc") {
      showToast("회비와 벌금 내역은 해당 관리 탭에서 변경해 주세요.", "info");
      return;
    }

    const confirmed = globalThis.confirm("이 내역을 삭제할까요?");
    if (!confirmed) return;

    const success = await deleteEntry(entryId);

    if (!success) {
      showToast("거래 내역 삭제에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 삭제했어요.", "success");
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
