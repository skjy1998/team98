import { settingsTabs, type SettingsTab } from "@/types/settings";

export function getSettingsTab(value: string | null): SettingsTab {
  return settingsTabs.includes(value as SettingsTab)
    ? (value as SettingsTab)
    : "profile";
}
