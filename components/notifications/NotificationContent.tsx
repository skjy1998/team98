import type {
  NotificationFilter,
  TeamNotification,
} from "@/types/notification";
import ContentState from "../common/ContentState";
import NotificationListItem from "./NotificationListItem";

interface NotificationContentProps {
  notifications: TeamNotification[];
  filter: NotificationFilter;
  isLoaded: boolean;
  error: string;
  onReload: () => Promise<void>;
  onOpen: (notification: TeamNotification) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
}

export default function NotificationContent({
  notifications,
  filter,
  isLoaded,
  error,
  onReload,
  onOpen,
  onDelete,
}: Readonly<NotificationContentProps>) {
  if (!isLoaded) {
    return (
      <ContentState
        variant="loading"
        title="알림을 불러오는 중..."
        description="새로운 팀 활동과 알림을 확인하고 있어요."
      />
    );
  }

  if (error) {
    return (
      <ContentState
        variant="error"
        title="알림을 불러오지 못했어요."
        description={error}
        action={
          <button
            type="button"
            onClick={() => void onReload()}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            다시 시도
          </button>
        }
      />
    );
  }

  if (notifications.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
