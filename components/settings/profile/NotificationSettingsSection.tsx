import { useNotificationSettings } from "@/hooks/settings/useNotificationSettings";
import type { NotificationSettings } from "@/types/settings";
import { Bell, CalendarCheck, ShieldCheck, WalletCards } from "lucide-react";
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
    description: "미투표 경기와 투표 마감 일정을 내 할 일에 표시해요.",
    icon: CalendarCheck,
  },
  {
    key: "financeEnabled",
    title: "회비·벌금 알림",
    description: "미납 회비와 미납 벌금을 내 할 일에 표시해요.",
    icon: WalletCards,
  },
  {
    key: "managementEnabled",
    title: "운영 알림",
    description: "출석, 경기 기록, 라인업 준비 항목을 운영진에게 표시해요.",
    icon: ShieldCheck,
  },
];

export default function NotificationSettingsSection() {
  const { settings, settingsLoaded, settingsError, isSaving, updateSetting } =
    useNotificationSettings();

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Bell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-stone-900">알림 설정</h2>
          <p className="mt-1 text-sm text-stone-400">
            대시보드 내 할 일에 표시할 항목을 선택하세요.
          </p>
        </div>
      </div>

      {settingsError && (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {settingsError}
        </p>
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
                  onClick={() => updateSetting(item.key, !enabled)}
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
