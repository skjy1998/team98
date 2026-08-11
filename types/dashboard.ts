import type { LucideIcon } from "lucide-react";

export type DashboardTodoType =
  | "match-vote"
  | "fee-unpaid"
  | "fine-unpaid"
  | "management";

export interface DashboardTodoItem {
  id: string;
  type: DashboardTodoType;
  title: string;
  description: string;
  href: string;
  priority: number;
}

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
