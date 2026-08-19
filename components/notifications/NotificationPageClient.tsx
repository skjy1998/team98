"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import type { TeamNotification } from "@/types/notification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "../PageHeader";
import { CheckCheck } from "lucide-react";
import NotificationListItem from "./NotificationListItem";
import ContentState from "../common/ContentState";
import { useToastStore } from "@/stores/toast-store";

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
  const showToast = useToastStore((state) => state.showToast);

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
          <ContentState
            variant="loading"
            title="알림을 불러오는 중..."
            description="새로운 팀 활동과 알림을 확인하고 있어요."
          />
        ) : notificationsError ? (
          <ContentState
            variant="error"
            title="알림을 불러오지 못했어요."
            description={notificationsError}
          />
        ) : displayedNotifications.length === 0 ? (
          <ContentState
            variant="empty"
            title={
              filter === "unread"
                ? "읽지 않은 알림이 없어요."
                : "새로운 알림이 없어요."
            }
            description={
              filter === "unread"
                ? "모든 알림을 확인했어요."
                : "새로운 팀 활동이 생기면 여기에 표시돼요."
            }
          />
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
