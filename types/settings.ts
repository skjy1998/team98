import type { PlayerDetailPosition } from "./player";

export const settingsTabs = ["profile", "team", "season"] as const;

export type SettingsTab = (typeof settingsTabs)[number];

export interface ProfilePlayerSettings {
  id: string;
  name: string;
  number?: number;
  detailPositions: PlayerDetailPosition[];
}

export interface ProfileSettingsData {
  userId: string;
  name: string;
  email: string;
  player: ProfilePlayerSettings | null;
}

export interface NotificationSettings {
  matchEnabled: boolean;
  financeEnabled: boolean;
  managementEnabled: boolean;
}
