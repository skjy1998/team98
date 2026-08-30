import type {
  NotificationFilter,
  TeamNotification,
} from "@/types/notification";

export function getUnreadNotificationCount(notifications: TeamNotification[]) {
  return notifications.filter((notification) => !notification.readAt).length;
}

export function getFilteredNotifications(
  notifications: TeamNotification[],
  filter: NotificationFilter,
) {
  return filter === "unread"
    ? notifications.filter((notification) => !notification.readAt)
    : notifications;
}

export function markNotificationReadInList(
  notifications: TeamNotification[],
  notificationId: string,
  readAt: string,
) {
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, readAt }
      : notification,
  );
}

export function markAllNotificationsReadInList(
  notifications: TeamNotification[],
  readAt: string,
) {
  return notifications.map((notification) => ({
    ...notification,
    readAt: notification.readAt ?? readAt,
  }));
}

export function removeNotificationFromList(
  notifications: TeamNotification[],
  notificationId: string,
) {
  return notifications.filter(
    (notification) => notification.id !== notificationId,
  );
}

export const notificationFilters: Array<{
  value: NotificationFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "unread", label: "읽지 않음" },
];

export function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
