import type { FeeType, FineRule } from "@/types/finance";
import { useEffect, useState } from "react";

export function useFinanceSettings() {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [dueDay, setDueDay] = useState("1");
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("finance-settings");

    if (savedSettings && savedSettings !== "undefined") {
      try {
        const parsed = JSON.parse(savedSettings);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeeTypes(parsed.feeTypes ?? []);
        setFineRules(parsed.fineRules ?? []);
        setDueDay(parsed.dueDay ?? "1");
      } catch {
        localStorage.removeItem("finance-settings");
      }
    }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    localStorage.setItem(
      "finance-settings",
      JSON.stringify({
        feeTypes,
        fineRules,
        dueDay,
      }),
    );
  }, [feeTypes, dueDay, fineRules, settingsLoaded]);

  const handleChangeDueDay = (value: string) => {
    setDueDay(value);
  };

  const handleAddFeeType = (nextFeeType: FeeType) => {
    setFeeTypes((prev) => [nextFeeType, ...prev]);
  };

  const handleUpdateFeeType = (
    feeTypeId: string,
    updates: Partial<FeeType>,
  ) => {
    setFeeTypes((prev) =>
      prev.map((feeType) =>
        feeType.id === feeTypeId ? { ...feeType, ...updates } : feeType,
      ),
    );
  };

  const handleDeleteFeeType = (feeTypeId: string) => {
    setFeeTypes((prev) => prev.filter((feeType) => feeType.id !== feeTypeId));
  };

  const handleAddFineRule = (nextFineRule: FineRule) => {
    setFineRules((prev) => [nextFineRule, ...prev]);
  };

  const handleDeleteFineRule = (fineRuleId: string) => {
    setFineRules((prev) =>
      prev.filter((fineRule) => fineRule.id !== fineRuleId),
    );
  };

  return {
    feeTypes,
    fineRules,
    dueDay,
    settingsLoaded,
    handleChangeDueDay,
    handleAddFeeType,
    handleUpdateFeeType,
    handleDeleteFeeType,
    handleAddFineRule,
    handleDeleteFineRule,
  };
}
