import { getFilteredNotifications } from "@/lib/notifications/notification-ui";
import { useToastStore } from "@/stores/toast-store";
import type {
  NotificationFilter,
  TeamNotification,
} from "@/types/notification";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface UseNotificationPageParams {
  notifications: TeamNotification[];
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
}

export function useNotificationPageState({
  notifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}: UseNotificationPageParams) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const displayedNotifications = useMemo(
    () => getFilteredNotifications(notifications, filter),
    [notifications, filter],
  );

  const handleOpenNotification = async (notification: TeamNotification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    router.push(notification.href);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);

    if (!success) {
      showToast("알림 삭제에 실패했어요.", "error");
      return;
    }

    showToast("알림을 삭제했어요.", "success");
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();

    if (!success) {
      showToast("알림 읽음 처리에 실패했어요.", "error");
      return;
    }

    showToast("모든 알림을 읽음 처리했어요.", "success");
  };

  return {
    filter,
    onChangeFilter: setFilter,
    displayedNotifications,
    handleOpenNotification,
    handleDeleteNotification,
    handleMarkAllAsRead,
  };
}
