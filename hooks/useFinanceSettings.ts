import type { FeeType, FineRule } from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "./useCurrentTeam";
import { supabase } from "@/lib/supabase";

export function useFinanceSettings() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [dueDay, setDueDay] = useState("1");
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setFeeTypes([]);
      setFineRules([]);
      setDueDay("1");
      setSettingsLoaded(true);
      return;
    }

    setSettingsLoaded(false);

    const { data, error } = await supabase
      .from("finance_settings")
      .select("due_day, fee_types, fine_rules")
      .eq("team_id", teamId)
      .maybeSingle();

    if (error || !data) {
      setFeeTypes([]);
      setFineRules([]);
      setDueDay("1");
      setSettingsLoaded(true);
      return;
    }

    setFeeTypes((data.fee_types as FeeType[] | null) ?? []);
    setFineRules((data.fine_rules as FineRule[] | null) ?? []);
    setDueDay(data.due_day ?? "1");
    setSettingsLoaded(true);
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

    const { error } = await supabase.from("finance_settings").upsert(
      {
        team_id: teamId,
        due_day: next.dueDay,
        fee_types: next.feeTypes,
        fine_rules: next.fineRules,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "team_id" },
    );
    return !error;
  };

  const handleChangeDueDay = async (value: string) => {
    const success = await saveSettings({
      dueDay: value,
      feeTypes,
      fineRules,
    });

    if (!success) {
      globalThis.alert("납부 기준일 저장에 실패했어요.");
      return;
    }

    setDueDay(value);
  };

  const handleAddFeeType = async (nextFeeType: FeeType) => {
    const nextFeeTypes = [...feeTypes, nextFeeType];

    const success = await saveSettings({
      dueDay,
      feeTypes: nextFeeTypes,
      fineRules,
    });

    if (!success) {
      globalThis.alert("회비 유형 저장에 실패했어요.");
      return;
    }

    setFeeTypes(nextFeeTypes);
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
      globalThis.alert("회비 유형 수정에 실패했어요.");
      return;
    }

    setFeeTypes(nextFeeTypes);
  };

  const handleDeleteFeeType = async (feeTypeId: string) => {
    const nextFeeTypes = feeTypes.filter((feeType) => feeType.id !== feeTypeId);

    const success = await saveSettings({
      dueDay,
      feeTypes: nextFeeTypes,
      fineRules,
    });

    if (!success) {
      globalThis.alert("회비 유형 삭제에 실패했어요.");
      return;
    }

    setFeeTypes(nextFeeTypes);
  };

  const handleAddFineRule = async (nextFineRule: FineRule) => {
    const nextFineRules = [nextFineRule, ...fineRules];

    const success = await saveSettings({
      dueDay,
      feeTypes,
      fineRules: nextFineRules,
    });

    if (!success) {
      globalThis.alert("벌금 규칙 저장에 실패했어요.");
      return false;
    }

    setFineRules(nextFineRules);
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
      globalThis.alert("벌금 규칙 삭제에 실패했어요.");
      return;
    }

    setFineRules(nextFineRules);
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
    reloadSettings: loadSettings,
  };
}
