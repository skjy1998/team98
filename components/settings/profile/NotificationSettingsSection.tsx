import { useNotificationSettings } from "@/hooks/settings/useNotificationSettings";
import type { NotificationSettings } from "@/types/settings";
import {
  Bell,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { ComponentType } from "react";
import NotificationSettingItem from "./NotificationSettingItem";

interface NotificationItem {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const notificationItems: NotificationItem[] = [
  {
    key: "matchEnabled",
    title: "경기 알림",
    description: "새 경기 등록과 일정 변경 알림을 받아요.",
    icon: CalendarCheck,
  },
  {
    key: "financeEnabled",
    title: "회비·벌금 알림",
    description: "회비 납부일과 벌금 부과 알림을 받아요.",
    icon: WalletCards,
  },
  {
    key: "managementEnabled",
    title: "운영 알림",
    description: "출석 확인과 경기 기록 마감 알림을 받아요.",
    icon: ShieldCheck,
  },
  {
    key: "boardEnabled",
    title: "게시판 알림",
    description: "새 게시물과 내 글에 달린 댓글 알림을 받아요.",
    icon: MessageSquare,
  },
];

export default function NotificationSettingsSection() {
  const {
    settings,
    settingsLoaded,
    settingsError,
    isSaving,
    updateSetting,
    reloadSettings,
  } = useNotificationSettings();

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Bell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-stone-900">알림 설정</h2>
          <p className="mt-1 text-sm text-stone-400">
            알림 센터와 대시보드에 표시할 항목을 선택하세요.
          </p>
        </div>
      </div>

      {settingsError && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{settingsError}</p>

          <button
            type="button"
            onClick={() => void reloadSettings()}
            className="shrink-0 text-sm font-semibold text-rose-600 underline underline-offset-4"
          >
            다시 불러오기
          </button>
        </div>
      )}

      {!settingsLoaded ? (
        <div className="mt-6 rounded-xl bg-stone-50 p-6 text-center text-sm text-stone-400">
          알림 설정을 불러오는 중...
        </div>
      ) : (
        <div className="mt-6 divide-y divide-stone-100">
          {notificationItems.map((item) => {
            const enabled = settings[item.key];

            return (
              <NotificationSettingItem
                key={item.key}
                title={item.title}
                description={item.description}
                icon={item.icon}
                enabled={enabled}
                disabled={isSaving}
                onToggle={() => void updateSetting(item.key, !enabled)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
