import type { FeeType } from "@/types/finance";
import { useState } from "react";

interface UseFinanceFeeSettingsStateParams {
  onAddFeeType: (nextFeeType: FeeType) => void;
  onUpdateFeeType: (feeTypeId: string, updates: Partial<FeeType>) => void;
  onDeleteFeeType: (feeType: string) => void;
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

  const handleCancelFeeType = () => {
    setIsAddingFeeType(false);
    setFeeTypeName("");
    setFeeTypeDescription("");
    setFeeTypeAmount(30000);
  };

  const handleSaveFeeType = () => {
    if (!feeTypeName.trim() || feeTypeAmount <= 0) {
      return;
    }

    onAddFeeType({
      id: crypto.randomUUID(),
      name: feeTypeName.trim(),
      description: feeTypeDescription,
      amount: feeTypeAmount,
    });

    handleCancelFeeType();
  };

  const handleDeleteFeeType = (feeTypeId: string) => {
    onDeleteFeeType(feeTypeId);
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

  const handleSaveEditFeeType = () => {
    if (!editingFeeTypeId || !editingFeeName.trim()) {
      return;
    }

    const nextAmount = Number(editingFeeAmount);

    if (nextAmount <= 0) {
      return;
    }

    onUpdateFeeType(editingFeeTypeId, {
      name: editingFeeName.trim(),
      description: editingFeeDescription,
      amount: nextAmount,
    });

    handleCancelEditFeeType();
  };

  return {
    isAddingFeeType,
    setIsAddingFeeType,
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
