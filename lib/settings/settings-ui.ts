import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
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

export function formatSeasonDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatSeasonPeriod(startDate: string, endDate?: string) {
  return `${formatSeasonDate(startDate)} - ${
    endDate ? formatSeasonDate(endDate) : "종료일 미정"
  }`;
}

export function getSeasonFormValue(season: TeamSeason): TeamSeasonFormValue {
  return {
    name: season.name,
    startDate: season.startDate,
    endDate: season.endDate,
  };
}
