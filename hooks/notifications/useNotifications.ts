import type { NotificationType, TeamNotification } from "@/types/notification";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useId, useState } from "react";
import { supabase } from "@/lib/supabase";

interface NotificationRow {
  id: string;
  team_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string;
  source_type: string | null;
  source_id: string | null;
  metadata: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

const NOTIFICATION_COLUMNS = `
  id,
  team_id,
  user_id,
  type,
  title,
  message,
  href,
  source_type,
  source_id,
  metadata,
  read_at,
  created_at
`;

function mapNotification(row: NotificationRow): TeamNotification {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    href: row.href,
    sourceType: row.source_type ?? undefined,
    sourceId: row.source_id ?? undefined,
    metadata: row.metadata ?? {},
    readAt: row.read_at ?? undefined,
    createdAt: row.created_at,
  };
}

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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setNotifications([]);
      setNotificationsError("로그인 정보를 확인할 수 없어요.");
      setNotificationsLoaded(true);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(NOTIFICATION_COLUMNS)
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      console.error("notifications load error", error);
      setNotifications([]);
      setNotificationsError("알림을 불러오지 못했어요.");
      setNotificationsLoaded(true);
      return;
    }

    setNotifications(
      (data as NotificationRow[]).map((row) => mapNotification(row)),
    );
    setNotificationsLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!teamId) return;

    const channel = supabase
      .channel(`notifications:${teamId}:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          void loadNotifications();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [teamId, channelId, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    const readAt = new Date().toISOString();

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("id", notificationId);

    if (error) {
      console.error("notifications read error", error);
      return false;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, readAt }
          : notification,
      ),
    );

    return true;
  };

  const markAllAsRead = async () => {
    if (!teamId) return false;

    const readAt = new Date().toISOString();

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("team_id", teamId)
      .is("read_at", null);

    if (error) {
      console.error("notifications read all error", error);
      return false;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        readAt: notification.readAt ?? readAt,
      })),
    );

    return true;
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("notification delete error", error);
      return false;
    }

    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId),
    );

    return true;
  };

  const unreadCount = notifications.reduce(
    (count, notification) => count + (notification.readAt ? 0 : 1),
    0,
  );

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
