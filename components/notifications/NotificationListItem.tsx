import { formatNotificationDate } from "@/lib/notifications/notification-ui";
import type { NotificationType, TeamNotification } from "@/types/notification";
import {
  BadgeDollarSign,
  CalendarDays,
  ClipboardCheck,
  MessageSquare,
  Settings,
  Trash2,
} from "lucide-react";

interface NotificationListItemProps {
  notification: TeamNotification;
  onOpen: (notification: TeamNotification) => void | Promise<void>;
  onDelete: (notificationId: string) => void | Promise<void>;
}

const notificationIcons: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  match: CalendarDays,
  finance: BadgeDollarSign,
  management: ClipboardCheck,
  board: MessageSquare,
  system: Settings,
};

const notificationIconClassName: Record<NotificationType, string> = {
  match: "bg-sky-50 text-sky-600",
  finance: "bg-amber-50 text-amber-600",
  management: "bg-emerald-50 text-emerald-600",
  board: "bg-orange-50 text-orange-600",
  system: "bg-stone-100 text-stone-600",
};

export default function NotificationListItem({
  notification,
  onOpen,
  onDelete,
}: Readonly<NotificationListItemProps>) {
  const Icon = notificationIcons[notification.type];

  return (
    <article
      className={[
        "group relative border-b border-stone-100 last:border-b-0",
        notification.readAt ? "bg-white" : "bg-emerald-50/40",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex w-full gap-3 px-5 py-4 pr-14 text-left transition hover:bg-stone-50"
      >
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            notificationIconClassName[notification.type],
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start gap-2">
            <span className="flex-1 text-sm font-semibold text-stone-900">
              {notification.title}
            </span>

            {!notification.readAt && (
              <span
                aria-label="읽지 않음"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
              />
            )}
          </span>

          <span className="mt-1 block text-sm leading-5 text-stone-500">
            {notification.message}
          </span>

          <span className="mt-2 block text-xs text-stone-400">
            {formatNotificationDate(notification.createdAt)}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onDelete(notification.id)}
        aria-label={`${notification.title} 알림 삭제`}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-stone-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
