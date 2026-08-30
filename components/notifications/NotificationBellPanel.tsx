import type { TeamNotification } from "@/types/notification";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import NotificationListItem from "./NotificationListItem";

interface NotificationBellPanelProps {
  align: "left" | "right";
  notifications: TeamNotification[];
  unreadCount: number;
  notificationsLoaded: boolean;
  notificationsError: string;
  onOpenNotification: (notification: TeamNotification) => void | Promise<void>;
  onDeleteNotification: (notificationId: string) => void | Promise<void>;
  onMarkAllAsRead: () => void | Promise<void>;
  onOpenAllNotifications: () => void;
  onRetry: () => void | Promise<void>;
}

export default function NotificationBellPanel({
  align,
  notifications,
  unreadCount,
  notificationsLoaded,
  notificationsError,
  onOpenNotification,
  onDeleteNotification,
  onMarkAllAsRead,
  onOpenAllNotifications,
  onRetry,
}: Readonly<NotificationBellPanelProps>) {
  return (
    <section
      id="notification-bell-panel"
      aria-label="알림 목록"
      className={[
        "absolute top-14 z-50 w-[380px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl",
        align === "left" ? "left-0" : "right-0",
      ].join(" ")}
    >
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-stone-900">알림</h2>
          <p className="mt-0.5 text-xs text-stone-400">
            읽지 않은 알림 {unreadCount}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            <CheckCheck className="h-4 w-4" />
            모두 읽음
          </button>
        )}
      </div>

      <div className="max-h-[440px] overflow-y-auto">
        {!notificationsLoaded ? (
          <p className="px-5 py-10 text-center text-sm text-stone-400">
            알림을 불러오는 중...
          </p>
        ) : notificationsError ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-rose-500">{notificationsError}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
            >
              다시 시도
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Bell className="mx-auto h-7 w-7 text-stone-300" />
            <p className="mt-3 text-sm font-medium text-stone-500">
              새로운 알림이 없어요.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onOpen={onOpenNotification}
              onDelete={onDeleteNotification}
            />
          ))
        )}
      </div>

      <div className="border-t border-stone-100 p-2">
        <button
          type="button"
          onClick={onOpenAllNotifications}
          className="flex w-full items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-emerald-700"
        >
          전체 알림 보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
