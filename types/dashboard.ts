import type { LucideIcon } from "lucide-react";

export interface DashboardTopRecordPlayer {
  name: string;
  appearance: number;
  goal: number;
  assist: number;
}

export interface DashboardQuickLink {
  href: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}
