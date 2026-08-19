import type { NotificationSettings } from "@/types/settings";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const defaultSettings: NotificationSettings = {
  matchEnabled: true,
  financeEnabled: true,
  managementEnabled: true,
  boardEnabled: true,
};

interface NotificationSettingRow {
  match_enabled: boolean;
  finance_enabled: boolean;
  management_enabled: boolean;
  board_enabled: boolean;
}

export function useNotificationSettings() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setSettings(defaultSettings);
      setSettingsLoaded(true);
      return;
    }

    setSettingsLoaded(false);
    setSettingsError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSettingsError("로그인 정보를 확인할 수 없어요.");
      setSettingsLoaded(true);
      return;
    }

    const { data, error } = await supabase
      .from("notification_settings")
      .select(
        "match_enabled, finance_enabled, management_enabled, board_enabled",
      )
      .eq("user_id", user.id)
      .eq("team_id", teamId)
      .maybeSingle();

    if (error) {
      console.error("notification settings load error", error);
      setSettingsError("알림 설정을 불러오지 못했어요.");
      setSettingsLoaded(true);
      return;
    }

    if (data) {
      const row = data as NotificationSettingRow;

      setSettings({
        matchEnabled: row.match_enabled,
        financeEnabled: row.finance_enabled,
        managementEnabled: row.management_enabled,
        boardEnabled: row.board_enabled,
      });
    } else {
      setSettings(defaultSettings);
    }

    setSettingsLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, [loadSettings]);

  const updateSetting = async (
    key: keyof NotificationSettings,
    enabled: boolean,
  ) => {
    if (!teamId || isSaving) return false;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSettingsError("로그인 정보를 확인할 수 없어요.");
      return false;
    }

    const nextSettings = {
      ...settings,
      [key]: enabled,
    };

    setIsSaving(true);
    setSettingsError("");

    const { error } = await supabase.from("notification_settings").upsert(
      {
        user_id: user.id,
        team_id: teamId,
        match_enabled: nextSettings.matchEnabled,
        finance_enabled: nextSettings.financeEnabled,
        management_enabled: nextSettings.managementEnabled,
        board_enabled: nextSettings.boardEnabled,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,team_id",
      },
    );

    setIsSaving(false);

    if (error) {
      console.error("notification settings update error", error);
      setSettingsError(error.message || "알림 설정 저장에 실패했어요.");
      return false;
    }

    setSettings(nextSettings);
    return true;
  };

  return {
    settings,
    settingsLoaded,
    settingsError,
    isSaving,
    updateSetting,
  };
}
