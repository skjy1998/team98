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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
      <div className="flex items-center gap-2">
        {notificationFilters.map((item) => {
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChangeFilter(item.value)}
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
          onClick={onMarkAllAsRead}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
        >
          <CheckCheck className="h-4 w-4" />
          모두 읽음
        </button>
      )}
    </div>
  );
}
