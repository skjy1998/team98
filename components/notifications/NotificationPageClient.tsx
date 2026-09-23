"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import PageHeader from "../PageHeader";
import { useNotificationPageState } from "@/hooks/notifications/useNotificationPageState";
import NotificationToolbar from "./NotificationToolbar";
import NotificationContent from "./NotificationContent";

export default function NotificationsPageClient() {
  const {
    notifications,
    unreadCount,
    notificationsLoaded,
    notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reloadNotifications,
  } = useNotifications();

  const {
    filter,
    onChangeFilter,
    displayedNotifications,
    handleOpenNotification,
    handleDeleteNotification,
    handleMarkAllAsRead,
  } = useNotificationPageState({
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="알림"
        description="팀 활동과 관련된 새로운 소식을 확인하세요."
      />

      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm sm:rounded-2xl">
        <NotificationToolbar
          filter={filter}
          unreadCount={unreadCount}
          onChangeFilter={onChangeFilter}
          onMarkAllAsRead={() => void handleMarkAllAsRead()}
        />

        <NotificationContent
          notifications={displayedNotifications}
          filter={filter}
          isLoaded={notificationsLoaded}
          error={notificationsError}
          onReload={reloadNotifications}
          onOpen={handleOpenNotification}
          onDelete={handleDeleteNotification}
        />
      </section>
    </div>
  );
}
