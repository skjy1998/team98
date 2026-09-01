import type { NotificationSettings } from "@/types/settings";
import { supabase } from "../supabase";

interface NotificationSettingsRow {
  match_enabled: boolean;
  finance_enabled: boolean;
  management_enabled: boolean;
  board_enabled: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  matchEnabled: true,
  financeEnabled: true,
  managementEnabled: true,
  boardEnabled: true,
};

function mapNotificationSettings(
  row: NotificationSettingsRow,
): NotificationSettings {
  return {
    matchEnabled: row.match_enabled,
    financeEnabled: row.finance_enabled,
    managementEnabled: row.management_enabled,
    boardEnabled: row.board_enabled,
  };
}

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("authenticated user not found");

  return user.id;
}

export async function getNotificationSettings(teamId: string) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("notification_settings")
    .select("match_enabled, finance_enabled, management_enabled, board_enabled")
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .maybeSingle();

  if (error) throw error;

  return data
    ? mapNotificationSettings(data as NotificationSettingsRow)
    : DEFAULT_NOTIFICATION_SETTINGS;
}

export async function saveNotificationSettings(
  teamId: string,
  settings: NotificationSettings,
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("notification_settings").upsert(
    {
      user_id: userId,
      team_id: teamId,
      match_enabled: settings.matchEnabled,
      finance_enabled: settings.financeEnabled,
      management_enabled: settings.managementEnabled,
      board_enabled: settings.boardEnabled,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,team_id",
    },
  );

  if (error) throw error;
}
