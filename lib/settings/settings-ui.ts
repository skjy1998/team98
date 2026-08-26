import { TeamSeason } from "@/types/seasons";
import { settingsTabs, type SettingsTab } from "@/types/settings";

export function getSettingsTab(value: string | null): SettingsTab {
  return settingsTabs.includes(value as SettingsTab)
    ? (value as SettingsTab)
    : "profile";
}

export function getSelectedSeason(
  seasons: TeamSeason[],
  requestedSeasonId: string | null,
) {
  return (
    seasons.find((season) => season.id === requestedSeasonId) ??
    seasons.find((season) => season.isActive)
  );
}
