"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import type { TeamNotification } from "@/types/notification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "../PageHeader";
import { Bell, CheckCheck } from "lucide-react";
import NotificationListItem from "./NotificationListItem";

type NotificationFilter = "all" | "unread";

const notificationFilters: {
  value: NotificationFilter;
  label: string;
}[] = [
  { value: "all", label: "전체" },
  { value: "unread", label: "읽지 않음" },
];

export default function NotificationsPageClient() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const {
    notifications,
    unreadCount,
    notificationsLoaded,
    notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.readAt)
      : notifications;

  const handleOpenNotification = async (notification: TeamNotification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    router.push(notification.href);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);

    if (!success) {
      globalThis.alert("알림 삭제에 실패했어요.");
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();

    if (!success) {
      globalThis.alert("알림 읽음 처리에 실패했어요.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="알림"
        description="팀 활동과 관련된 새로운 소식을 확인하세요."
      />

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div className="flex items-center gap-2">
            {notificationFilters.map((item) => {
              const isActive = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={isActive}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-800",
                  ].join(" ")}
                >
                  {item.label}
                  {item.value === "unread" && unreadCount > 0
                    ? ` ${unreadCount}`
                    : ""}
                </button>
              );
            })}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
            >
              <CheckCheck className="h-4 w-4" />
              모두 읽음
            </button>
          )}
        </div>

        {!notificationsLoaded ? (
          <p className="px-5 py-16 text-center text-sm text-stone-400">
            알림을 불러오는 중...
          </p>
        ) : notificationsError ? (
          <p className="px-5 py-16 text-center text-sm text-rose-500">
            {notificationsError}
          </p>
        ) : displayedNotifications.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
              <Bell className="h-6 w-6" />
            </span>

            <p className="mt-4 text-sm font-semibold text-stone-700">
              {filter === "unread"
                ? "읽지 않은 알림이 없어요."
                : "새로운 알림이 없어요."}
            </p>
          </div>
        ) : (
          <div>
            {displayedNotifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onOpen={handleOpenNotification}
                onDelete={handleDeleteNotification}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
