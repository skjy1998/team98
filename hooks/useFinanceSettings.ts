import type { FeeType, FineRule } from "@/types/finance";
import { useEffect, useState } from "react";

export function useFinanceSettings() {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [dueDay, setDueDay] = useState("1");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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

  useEffect(() => {
    if (!saveMessage) return;

    const timer = setTimeout(() => {
      setSaveMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [saveMessage]);

  const handleChangeDueDay = (value: string) => {
    setDueDay(value);
  };

  const handleAddFeeType = (nextFeeType: FeeType) => {
    setFeeTypes((prev) => [nextFeeType, ...prev]);
    setSaveMessage("회비 유형이 추가되었습니다.");
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
    setSaveMessage("회비 유형이 수정되었습니다.");
  };

  const handleDeleteFeeType = (feeTypeId: string) => {
    setFeeTypes((prev) => prev.filter((feeType) => feeType.id !== feeTypeId));
    setSaveMessage("회비 유형이 삭제되었습니다.");
  };

  const handleAddFineRule = (nextFineRule: FineRule) => {
    setFineRules((prev) => [nextFineRule, ...prev]);
    setSaveMessage("벌금 규칙이 추가되었습니다.");
  };

  const handleUpdateFineRule = (
    fineRuleId: string,
    updates: Partial<FineRule>,
  ) => {
    setFineRules((prev) =>
      prev.map((fineRule) =>
        fineRule.id === fineRuleId ? { ...fineRule, ...updates } : fineRule,
      ),
    );
    setSaveMessage("벌금 규칙이 수정되었습니다.");
  };

  const handleDeleteFineRule = (fineRuleId: string) => {
    setFineRules((prev) =>
      prev.filter((fineRule) => fineRule.id !== fineRuleId),
    );
    setSaveMessage("벌금 규칙이 삭제되었습니다.");
  };

  return {
    feeTypes,
    fineRules,
    dueDay,
    saveMessage,
    settingsLoaded,
    handleChangeDueDay,
    handleAddFeeType,
    handleUpdateFeeType,
    handleDeleteFeeType,
    handleAddFineRule,
    handleUpdateFineRule,
    handleDeleteFineRule,
  };
}
