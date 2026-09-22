import type { ComponentType } from "react";

interface NotificationSettingItemProps {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export default function NotificationSettingItem({
  title,
  description,
  icon: Icon,
  enabled,
  disabled,
  onToggle,
}: Readonly<NotificationSettingItemProps>) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-5 sm:py-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 sm:h-10 sm:w-10 sm:rounded-xl">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800 sm:text-base">
            {title}
          </p>
          <p className="mt-0.5 truncate text-xs text-stone-400 sm:mt-1 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title} ${enabled ? "끄기" : "켜기"}`}
        disabled={disabled}
        onClick={onToggle}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 sm:h-7 sm:w-12",
          enabled ? "bg-emerald-500" : "bg-stone-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition sm:top-1",
            enabled ? "left-5 sm:left-6" : "left-0.5 sm:left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
