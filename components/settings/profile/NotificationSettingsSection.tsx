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
            const Icon = item.icon;
            const enabled = settings[item.key];

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-stone-800">{item.title}</p>
                    <p className="mt-1 text-sm text-stone-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${item.title} ${enabled ? "끄기" : "켜기"}`}
                  disabled={isSaving}
                  onClick={() => void updateSetting(item.key, !enabled)}
                  className={[
                    "relative h-7 w-12 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50",
                    enabled ? "bg-emerald-500" : "bg-stone-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
                      enabled ? "left-6" : "left-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
