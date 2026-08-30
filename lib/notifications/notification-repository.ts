import type { NotificationType, TeamNotification } from "@/types/notification";
import { supabase } from "../supabase";

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

export class NotificationAuthenticationError extends Error {
  constructor() {
    super("Notification user is not authenticated");
    this.name = "NotificationAuthenticationError";
  }
}

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

async function getAuthenticatedUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new NotificationAuthenticationError();

  return user.id;
}

export async function getCurrentUserNotifications(teamId: string) {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("notifications")
    .select(NOTIFICATION_COLUMNS)
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data as NotificationRow[]).map(mapNotification);
}

export async function markTeamNotificationRead(
  teamId: string,
  notificationId: string,
  readAt: string,
) {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("id", notificationId)
    .eq("team_id", teamId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function markAllTeamNotificationsRead(
  teamId: string,
  readAt: string,
) {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
}

export async function deleteTeamNotification(
  teamId: string,
  notificationId: string,
) {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("team_id", teamId)
    .eq("user_id", userId);

  if (error) throw error;
}

export function subscribeToTeamNotifications(
  teamId: string,
  channelId: string,
  onChange: () => void,
) {
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
      onChange,
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
