import type { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { getFinanceEntryFromForm } from "@/lib/finance/finance-transaction";
import { useToastStore } from "@/stores/toast-store";
import { useState } from "react";

interface UseFinanceEditEntryFormParams {
  defaultDate: string;
  defaultTime: string;
  updateEntry: (
    entryId: string,
    updates: Omit<FinanceEntry, "id">,
  ) => Promise<boolean>;
  onStartEdit: () => void;
}

export function useFinanceEditEntryForm({
  defaultDate,
  defaultTime,
  updateEntry,
  onStartEdit,
}: UseFinanceEditEntryFormParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editEntryType, setEditEntryType] =
    useState<FinanceEntryType>("income");
  const [editEntryAmount, setEditEntryAmount] = useState("");
  const [editEntryDescription, setEditEntryDescription] = useState("");
  const [editEntryDate, setEditEntryDate] = useState(defaultDate);
  const [editEntryTime, setEditEntryTime] = useState(defaultTime);

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

    onStartEdit();
    setEditingEntryId(entry.id);
    setEditEntryType(entry.type);
    setEditEntryAmount(String(entry.amount));
    setEditEntryDescription(entry.description);
    setEditEntryDate(entry.date);
    setEditEntryTime(entry.time);
  };

  const handleSubmitEditEntry = async () => {
    if (!editingEntryId) return;

    const updates = getFinanceEntryFromForm({
      type: editEntryType,
      amount: editEntryAmount,
      description: editEntryDescription,
      date: editEntryDate,
      time: editEntryTime,
    });

    if (!updates) {
      showToast("내용과 올바른 금액을 입력해 주세요.", "info");
      return;
    }

    const success = await updateEntry(editingEntryId, updates);

    if (!success) {
      showToast("거래 내역 수정에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 수정했어요.", "success");
    resetEditForm();
  };

  return {
    editingEntryId,
    editEntryType,
    editEntryAmount,
    editEntryDescription,
    editEntryDate,
    editEntryTime,
    setEditEntryType,
    setEditEntryAmount,
    setEditEntryDescription,
    setEditEntryDate,
    setEditEntryTime,
    handleStartEdit,
    handleCancelEdit: resetEditForm,
    handleSubmitEditEntry,
  };
}
