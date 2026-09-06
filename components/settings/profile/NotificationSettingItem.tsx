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
    <div className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-semibold text-stone-800">{title}</p>
          <p className="mt-1 text-sm text-stone-400">{description}</p>
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
}
