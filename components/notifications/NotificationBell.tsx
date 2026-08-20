"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NotificationListItem from "./NotificationListItem";
import { useToastStore } from "@/stores/toast-store";

interface NotificationBellProps {
  align?: "left" | "right";
}

export default function NotificationBell({
  align = "right",
}: Readonly<NotificationBellProps>) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenNotification = async (
    notificationId: string,
    href: string,
    isRead: boolean,
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }

    setIsOpen(false);
    router.push(href);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);

    if (!success) {
      showToast("알림 삭제에 실패했어요.", "error");
      return;
    }

    showToast("알림을 삭제했어요.", "success");
  };

  return (
    <div ref={containerRef} className="relative z-30">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={
          unreadCount > 0 ? `알림 ${unreadCount}개 확인하기` : "알림 확인하기"
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
        <section
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
                읽지 않은 알림 {unreadCount}개
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
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
              <p className="px-5 py-10 text-center text-sm text-rose-500">
                {notificationsError}
              </p>
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
                  onOpen={(selectedNotification) =>
                    handleOpenNotification(
                      selectedNotification.id,
                      selectedNotification.href,
                      Boolean(selectedNotification.readAt),
                    )
                  }
                  onDelete={handleDeleteNotification}
                />
              ))
            )}
          </div>
          <div className="border-t border-stone-100 p-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/notifications");
              }}
              className="flex w-full items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-emerald-700"
            >
              전체 알림 보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
