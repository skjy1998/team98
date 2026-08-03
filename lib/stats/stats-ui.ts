import type { StatsTab } from "@/types/stats";

export function getStatsTab(tab: string | null): StatsTab {
  if (tab === "me" || tab === "team" || tab === "ranking") {
    return tab;
  }

  return "me";
}
