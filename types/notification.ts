export const notificationTypes = [
  "match",
  "finance",
  "management",
  "board",
  "system",
] as const;

export type NotificationType = (typeof notificationTypes)[number];

export interface TeamNotification {
  id: string;
  teamId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string;
  sourceType?: string;
  sourceId?: string;
  metadata: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
}
