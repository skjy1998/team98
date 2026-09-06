"use client";

import { useNotificationDataSource } from "@/hooks/notifications/useNotificationDataSource";
import {
  NotificationContext,
  type NotificationContextValue,
} from "@/hooks/notifications/useNotifications";
import { type ReactNode, useMemo } from "react";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: Readonly<NotificationProviderProps>) {
  const {
    notifications,
    unreadCount,
    notificationsLoaded,
    notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reloadNotifications,
  } = useNotificationDataSource();

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      notificationsLoaded,
      notificationsError,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      reloadNotifications,
    }),
    [
      notifications,
      unreadCount,
      notificationsLoaded,
      notificationsError,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      reloadNotifications,
    ],
  );

  return (
    <NotificationContext value={contextValue}>{children}</NotificationContext>
  );
}
