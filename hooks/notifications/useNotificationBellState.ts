import type { TeamNotification } from "@/types/notification";
import { useToastStore } from "@/stores/toast-store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UseNotificationBellStateParams {
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
}

export function useNotificationBellState({
  markAsRead,
  markAllAsRead,
  deleteNotification,
}: UseNotificationBellStateParams) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleOpenNotification = async (notification: TeamNotification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);
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

  const handleOpenAllNotifications = () => {
    setIsOpen(false);
    router.push("/notifications");
  };

  return {
    containerRef,
    isOpen,
    handleToggle: () => setIsOpen((current) => !current),
    handleOpenNotification,
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleOpenAllNotifications,
  };
}
