import { notificationFilters } from "@/lib/notifications/notification-ui";
import type { NotificationFilter } from "@/types/notification";
import { CheckCheck } from "lucide-react";

interface NotificationToolbarProps {
  filter: NotificationFilter;
  unreadCount: number;
  onChangeFilter: (filter: NotificationFilter) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationToolbar({
  filter,
  unreadCount,
  onChangeFilter,
  onMarkAllAsRead,
}: Readonly<NotificationToolbarProps>) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        {notificationFilters.map((item) => {
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChangeFilter(item.value)}
              aria-pressed={isActive}
              className={[
                "h-9 rounded-lg px-2.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm",
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
          onClick={onMarkAllAsRead}
          aria-label="모든 알림 읽음 처리"
          title="모두 읽음"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 sm:text-sm sm:font-bold"
        >
          <CheckCheck className="h-4 w-4" />
          <span className="hidden sm:inline">모두 읽음</span>
        </button>
      )}
    </div>
  );
}
