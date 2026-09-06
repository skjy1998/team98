import { createContext, useContext } from "react";
import type { useNotificationDataSource } from "./useNotificationDataSource";

export type NotificationContextValue = ReturnType<
  typeof useNotificationDataSource
>;

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }

  return context;
}
