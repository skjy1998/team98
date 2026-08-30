"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import { Bell } from "lucide-react";
import { useNotificationBellState } from "@/hooks/notifications/useNotificationBellState";
import NotificationBellPanel from "./NotificationBellPanel";

interface NotificationBellProps {
  align?: "left" | "right";
}

export default function NotificationBell({
  align = "right",
}: Readonly<NotificationBellProps>) {
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
    containerRef,
    isOpen,
    handleToggle,
    handleOpenNotification,
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleOpenAllNotifications,
  } = useNotificationBellState({
    markAsRead,
    markAllAsRead,
    deleteNotification,
  });

  return (
    <div ref={containerRef} className="relative z-30">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          unreadCount > 0 ? `알림 ${unreadCount}개 확인하기` : "알림 확인하기"
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? "notification-bell-panel" : undefined}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationBellPanel
          align={align}
          notifications={notifications}
          unreadCount={unreadCount}
          notificationsLoaded={notificationsLoaded}
          notificationsError={notificationsError}
          onOpenNotification={handleOpenNotification}
          onDeleteNotification={handleDeleteNotification}
          onMarkAllAsRead={handleMarkAllAsRead}
          onOpenAllNotifications={handleOpenAllNotifications}
          onRetry={reloadNotifications}
        />
      )}
    </div>
  );
}
