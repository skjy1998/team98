import { getFinanceEntryFromForm } from "@/lib/finance/finance-transaction";
import { useToastStore } from "@/stores/toast-store";
import type { FinanceEntry, FinanceEntryType } from "@/types/finance";
import { useState } from "react";

interface UseFinanceCreateEntryFormParams {
  defaultDate: string;
  defaultTime: string;
  addEntry: (entry: Omit<FinanceEntry, "id">) => Promise<boolean>;
}

export function useFinanceCreateEntryForm({
  defaultDate,
  defaultTime,
  addEntry,
}: UseFinanceCreateEntryFormParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [createEntryType, setCreateEntryType] =
    useState<FinanceEntryType>("income");
  const [createEntryAmount, setCreateEntryAmount] = useState("");
  const [createEntryDescription, setCreateEntryDescription] = useState("");
  const [createEntryDate, setCreateEntryDate] = useState(defaultDate);
  const [createEntryTime, setCreateEntryTime] = useState(defaultTime);

  const resetCreateForm = () => {
    setCreateEntryType("income");
    setCreateEntryAmount("");
    setCreateEntryDescription("");
    setCreateEntryDate(defaultDate);
    setCreateEntryTime(defaultTime);
  };

  const closeEntryForm = () => {
    setIsEntryFormOpen(false);
  };

  const handleToggleEntryForm = () => {
    setIsEntryFormOpen((previous) => !previous);
  };

  const handleSubmitCreateEntry = async () => {
    const entry = getFinanceEntryFromForm({
      type: createEntryType,
      amount: createEntryAmount,
      description: createEntryDescription,
      date: createEntryDate,
      time: createEntryTime,
    });

    if (!entry) {
      showToast("내용과 올바른 금액을 입력해 주세요.", "info");
      return;
    }

    const success = await addEntry(entry);

    if (!success) {
      showToast("거래 내역 저장에 실패했어요.", "error");
      return;
    }

    showToast("거래 내역을 추가했어요.", "success");
    resetCreateForm();
    closeEntryForm();
  };

  return {
    isEntryFormOpen,
    createEntryType,
    createEntryAmount,
    createEntryDescription,
    createEntryDate,
    createEntryTime,
    setCreateEntryType,
    setCreateEntryAmount,
    setCreateEntryDescription,
    setCreateEntryDate,
    setCreateEntryTime,
    closeEntryForm,
    handleToggleEntryForm,
    handleSubmitCreateEntry,
  };
}
