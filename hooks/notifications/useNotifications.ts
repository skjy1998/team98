import type { TeamNotification } from "@/types/notification";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useId, useState } from "react";
import {
  deleteTeamNotification,
  getCurrentUserNotifications,
  markAllTeamNotificationsRead,
  markTeamNotificationRead,
  NotificationAuthenticationError,
  subscribeToTeamNotifications,
} from "@/lib/notifications/notification-repository";
import {
  getUnreadNotificationCount,
  markAllNotificationsReadInList,
  markNotificationReadInList,
  removeNotificationFromList,
} from "@/lib/notifications/notification-ui";

export function useNotifications() {
  const channelId = useId().replaceAll(":", "");
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [notifications, setNotifications] = useState<TeamNotification[]>([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  const loadNotifications = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setNotifications([]);
      setNotificationsLoaded(true);
      return;
    }

    setNotificationsLoaded(false);
    setNotificationsError("");

    try {
      const nextNotifications = await getCurrentUserNotifications(teamId);

      setNotifications(nextNotifications);
    } catch (error) {
      console.error("notifications load error", error);
      setNotifications([]);

      setNotificationsError(
        error instanceof NotificationAuthenticationError
          ? "로그인 정보를 확인할 수 없어요."
          : "알림을 불러오지 못했어요.",
      );
    } finally {
      setNotificationsLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!teamId) return;

    return subscribeToTeamNotifications(teamId, channelId, () => {
      void loadNotifications();
    });
  }, [teamId, channelId, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!teamId) return false;

    const readAt = new Date().toISOString();

    try {
      const updated = await markTeamNotificationRead(
        teamId,
        notificationId,
        readAt,
      );

      if (!updated) return false;

      setNotifications((current) =>
        markNotificationReadInList(current, notificationId, readAt),
      );
      return true;
    } catch (error) {
      console.error("notifications read error", error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!teamId) return false;

    const readAt = new Date().toISOString();

    try {
      await markAllTeamNotificationsRead(teamId, readAt);

      setNotifications((current) =>
        markAllNotificationsReadInList(current, readAt),
      );

      return true;
    } catch (error) {
      console.error("notifications read all error", error);
      return false;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!teamId) return false;

    try {
      const deleted = await deleteTeamNotification(teamId, notificationId);

      if (!deleted) return false;

      setNotifications((current) =>
        removeNotificationFromList(current, notificationId),
      );

      return true;
    } catch (error) {
      console.error("notification delete error", error);
      return false;
    }
  };

  const unreadCount = getUnreadNotificationCount(notifications);

  return {
    notifications,
    unreadCount,
    notificationsLoaded,
    notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reloadNotifications: loadNotifications,
  };
}
