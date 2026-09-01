import type { NotificationSettings } from "@/types/settings";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  saveNotificationSettings,
} from "@/lib/settings/notification-settings-repository";

export function useNotificationSettings() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setSettings(DEFAULT_NOTIFICATION_SETTINGS);
      setSettingsLoaded(true);
      setSettingsError("");
      return;
    }

    setSettingsLoaded(false);
    setSettingsError("");

    try {
      const nextSettings = await getNotificationSettings(teamId);
      setSettings(nextSettings);
    } catch (error) {
      console.error("notification settings load error", error);
      setSettings(DEFAULT_NOTIFICATION_SETTINGS);
      setSettingsError("알림 설정을 불러오지 못했어요.");
    } finally {
      setSettingsLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSettings();
  }, [loadSettings]);

  const updateSetting = async (
    key: keyof NotificationSettings,
    enabled: boolean,
  ) => {
    if (!teamId || isSaving) return false;

    const nextSettings = {
      ...settings,
      [key]: enabled,
    };

    setIsSaving(true);
    setSettingsError("");

    try {
      await saveNotificationSettings(teamId, nextSettings);
      setSettings(nextSettings);
      return true;
    } catch (error) {
      console.error("notification settings update error", error);
      setSettingsError("알림 설정 저장에 실패했어요.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    settingsLoaded,
    settingsError,
    isSaving,
    updateSetting,
    reloadSettings: loadSettings,
  };
}
