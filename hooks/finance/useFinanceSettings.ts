import type { FeeType, FineRule } from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useToastStore } from "@/stores/toast-store";
import {
  getTeamFinanceSettings,
  saveTeamFinanceSettings,
} from "@/lib/finance/finance-settings-repository";

export function useFinanceSettings() {
  const showToast = useToastStore((state) => state.showToast);

  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [dueDay, setDueDay] = useState("1");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const loadSettings = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setFeeTypes([]);
      setFineRules([]);
      setDueDay("1");
      setSettingsLoaded(true);
      setSettingsError("");
      return;
    }

    setSettingsLoaded(false);
    setSettingsError("");

    try {
      const nextSettings = await getTeamFinanceSettings(teamId);

      setFeeTypes(nextSettings.feeTypes);
      setFineRules(nextSettings.fineRules);
      setDueDay(nextSettings.dueDay);
    } catch (error) {
      console.error("finance settings load error", error);
      setFeeTypes([]);
      setFineRules([]);
      setDueDay("1");
      setSettingsError("회비 설정을 불러오지 못했어요.");
    } finally {
      setSettingsLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async (next: {
    dueDay: string;
    feeTypes: FeeType[];
    fineRules: FineRule[];
  }) => {
    if (!teamId) return false;

    try {
      await saveTeamFinanceSettings(teamId, next);
      return true;
    } catch (error) {
      console.error("finance settings save error", error);
      return false;
    }
  };

  const handleChangeDueDay = async (value: string) => {
    const success = await saveSettings({
      dueDay: value,
      feeTypes,
      fineRules,
    });

    if (!success) {
      showToast("납부 기준일 저장에 실패했어요.", "error");
      return false;
    }

    setDueDay(value);
    showToast("납부 기준일을 저장했어요.", "success");
    return true;
  };

  const handleAddFeeType = async (nextFeeType: FeeType) => {
    const nextFeeTypes = [...feeTypes, nextFeeType];

    const success = await saveSettings({
      dueDay,
      feeTypes: nextFeeTypes,
      fineRules,
    });

    if (!success) {
      showToast("회비 유형 저장에 실패했어요.", "error");
      return false;
    }

    setFeeTypes(nextFeeTypes);
    showToast("회비 유형을 추가했어요.", "success");
    return true;
  };

  const handleUpdateFeeType = async (
    feeTypeId: string,
    updates: Partial<FeeType>,
  ) => {
    const nextFeeTypes = feeTypes.map((feeType) =>
      feeType.id === feeTypeId ? { ...feeType, ...updates } : feeType,
    );

    const success = await saveSettings({
      dueDay,
      feeTypes: nextFeeTypes,
      fineRules,
    });

    if (!success) {
      showToast("회비 유형 수정에 실패했어요.", "error");
      return false;
    }

    setFeeTypes(nextFeeTypes);
    showToast("회비 유형을 수정했어요.", "success");
    return true;
  };

  const handleDeleteFeeType = async (feeTypeId: string) => {
    const nextFeeTypes = feeTypes.filter((feeType) => feeType.id !== feeTypeId);

    const success = await saveSettings({
      dueDay,
      feeTypes: nextFeeTypes,
      fineRules,
    });

    if (!success) {
      showToast("회비 유형 삭제에 실패했어요.", "error");
      return false;
    }

    setFeeTypes(nextFeeTypes);
    showToast("회비 유형을 삭제했어요.", "success");
    return true;
  };

  const handleAddFineRule = async (nextFineRule: FineRule) => {
    const nextFineRules = [nextFineRule, ...fineRules];

    const success = await saveSettings({
      dueDay,
      feeTypes,
      fineRules: nextFineRules,
    });

    if (!success) {
      showToast("벌금 규칙 저장에 실패했어요.", "error");
      return false;
    }

    setFineRules(nextFineRules);
    showToast("벌금 규칙을 추가했어요.", "success");
    return true;
  };

  const handleDeleteFineRule = async (fineRuleId: string) => {
    const nextFineRules = fineRules.filter(
      (fineRule) => fineRule.id !== fineRuleId,
    );

    const success = await saveSettings({
      dueDay,
      feeTypes,
      fineRules: nextFineRules,
    });

    if (!success) {
      showToast("벌금 규칙 삭제에 실패했어요.", "error");
      return false;
    }

    setFineRules(nextFineRules);
    showToast("벌금 규칙을 삭제했어요.", "success");
    return true;
  };

  return {
    feeTypes,
    fineRules,
    dueDay,
    settingsLoaded,
    settingsError,
    handleChangeDueDay,
    handleAddFeeType,
    handleUpdateFeeType,
    handleDeleteFeeType,
    handleAddFineRule,
    handleDeleteFineRule,
    reloadSettings: loadSettings,
  };
}
