import { getFilteredFinanceEntries } from "@/lib/finance/finance-transaction";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { FinanceEntry, FinanceEntryFilter } from "@/types/finance";
import { useMemo, useState } from "react";
import { useFinanceCreateEntryForm } from "./useFinanceCreateEntryForm";
import { useFinanceEditEntryForm } from "./useFinanceEditEntryForm";

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
  const confirm = useConfirmStore((state) => state.confirm);

  const createEntry = useFinanceCreateEntryForm({
    defaultDate,
    defaultTime,
    addEntry,
  });

  const editEntry = useFinanceEditEntryForm({
    defaultDate,
    defaultTime,
    updateEntry,
    onStartEdit: createEntry.closeEntryForm,
  });

  const [search, setSearch] = useState("");

  const [entryFilter, setEntryFilter] = useState<FinanceEntryFilter>("all");

  const handleDeleteEntry = async (entryId: string) => {
    const targetEntry = entries.find((entry) => entry.id === entryId);

    if (!targetEntry) return;

    if (targetEntry.category && targetEntry.category !== "etc") {
      showToast("회비와 벌금 내역은 해당 관리 탭에서 변경해 주세요.", "info");
      return;
    }

    const confirmed = await confirm({
      title: "거래 내역 삭제",
      description: "이 거래 내역을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await deleteEntry(entryId);

    if (!success) {
      showToast("거래 내역 삭제에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 삭제했어요.", "success");
  };

  const handleToggleEntryForm = () => {
    editEntry.handleCancelEdit();
    createEntry.handleToggleEntryForm();
  };

  const filteredEntries = useMemo(
    () => getFilteredFinanceEntries(entries, currentMonth, search, entryFilter),
    [entries, currentMonth, search, entryFilter],
  );

  return {
    ...createEntry,
    ...editEntry,
    search,
    entryFilter,
    filteredEntries,
    setSearch,
    setEntryFilter,
    handleToggleEntryForm,
    handleDeleteEntry,
  };
}
