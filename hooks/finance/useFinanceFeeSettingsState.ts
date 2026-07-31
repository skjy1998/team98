import type { FeeType } from "@/types/finance";
import { useRef, useState } from "react";

interface UseFinanceFeeSettingsStateParams {
  onAddFeeType: (nextFeeType: FeeType) => Promise<boolean>;
  onUpdateFeeType: (
    feeTypeId: string,
    updates: Partial<FeeType>,
  ) => Promise<boolean>;
  onDeleteFeeType: (feeType: string) => Promise<boolean>;
}

export function useFinanceFeeSettingsState({
  onAddFeeType,
  onUpdateFeeType,
  onDeleteFeeType,
}: Readonly<UseFinanceFeeSettingsStateParams>) {
  const [isAddingFeeType, setIsAddingFeeType] = useState(false);
  const [feeTypeName, setFeeTypeName] = useState("");
  const [feeTypeDescription, setFeeTypeDescription] = useState("");
  const [feeTypeAmount, setFeeTypeAmount] = useState(30000);

  const [editingFeeTypeId, setEditingFeeTypeId] = useState<string | null>(null);
  const [editingFeeName, setEditingFeeName] = useState("");
  const [editingFeeDescription, setEditingFeeDescription] = useState("");
  const [editingFeeAmount, setEditingFeeAmount] = useState("");

  const [isFeeTypeSubmitting, setIsFeeTypeSubmitting] = useState(false);
  const isFeeTypeSubmittingRef = useRef(false);

  const runFeeTypeMutation = async (mutation: () => Promise<boolean>) => {
    if (isFeeTypeSubmittingRef.current) return false;

    isFeeTypeSubmittingRef.current = true;
    setIsFeeTypeSubmitting(true);

    try {
      return await mutation();
    } finally {
      isFeeTypeSubmittingRef.current = false;
      setIsFeeTypeSubmitting(false);
    }
  };

  const handleCancelFeeType = () => {
    setIsAddingFeeType(false);
    setFeeTypeName("");
    setFeeTypeDescription("");
    setFeeTypeAmount(30000);
  };

  const handleSaveFeeType = async () => {
    if (!feeTypeName.trim() || feeTypeAmount <= 0) return;

    const success = await runFeeTypeMutation(() =>
      onAddFeeType({
        id: crypto.randomUUID(),
        name: feeTypeName.trim(),
        description: feeTypeDescription,
        amount: feeTypeAmount,
      }),
    );

    if (!success) return;

    handleCancelFeeType();
  };

  const handleDeleteFeeType = async (feeTypeId: string) => {
    if (isFeeTypeSubmittingRef.current) return;

    const confirmed = globalThis.confirm("이 회비 유형을 삭제할까요?");

    if (!confirmed) return;

    await runFeeTypeMutation(() => onDeleteFeeType(feeTypeId));
  };

  const handleStartEditFeeType = (feeType: FeeType) => {
    setIsAddingFeeType(false);
    setEditingFeeTypeId(feeType.id);
    setEditingFeeName(feeType.name);
    setEditingFeeDescription(feeType.description ?? "");
    setEditingFeeAmount(String(feeType.amount));
  };

  const handleCancelEditFeeType = () => {
    setEditingFeeTypeId(null);
    setEditingFeeName("");
    setEditingFeeDescription("");
    setEditingFeeAmount("");
  };

  const handleSaveEditFeeType = async () => {
    if (!editingFeeTypeId || !editingFeeName.trim()) return;

    const nextAmount = Number(editingFeeAmount);

    if (nextAmount <= 0) return;

    const success = await runFeeTypeMutation(() =>
      onUpdateFeeType(editingFeeTypeId, {
        name: editingFeeName.trim(),
        description: editingFeeDescription,
        amount: nextAmount,
      }),
    );

    if (!success) return;

    handleCancelEditFeeType();
  };

  return {
    isAddingFeeType,
    setIsAddingFeeType,
    isFeeTypeSubmitting,
    feeTypeName,
    setFeeTypeName,
    feeTypeDescription,
    setFeeTypeDescription,
    feeTypeAmount,
    setFeeTypeAmount,
    editingFeeTypeId,
    editingFeeName,
    setEditingFeeName,
    editingFeeDescription,
    setEditingFeeDescription,
    editingFeeAmount,
    setEditingFeeAmount,
    handleCancelFeeType,
    handleSaveFeeType,
    handleDeleteFeeType,
    handleStartEditFeeType,
    handleCancelEditFeeType,
    handleSaveEditFeeType,
  };
}
