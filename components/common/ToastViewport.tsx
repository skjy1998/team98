"use client";

import { type ToastVariant, useToastStore } from "@/stores/toast-store";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import type { ComponentType } from "react";

const toastStyles: Record<
  ToastVariant,
  {
    Icon: ComponentType<{ className?: string }>;
    containerClassName: string;
    iconClassName: string;
  }
> = {
  success: {
    Icon: CheckCircle2,
    containerClassName: "border-emerald-200 bg-emerald-50",
    iconClassName: "text-emerald-600",
  },
  error: {
    Icon: CircleAlert,
    containerClassName: "border-rose-200 bg-rose-50",
    iconClassName: "text-rose-600",
  },
  info: {
    Icon: Info,
    containerClassName: "border-sky-200 bg-sky-50",
    iconClassName: "text-sky-600",
  },
};

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <ol
      aria-live="polite"
      aria-label="알림 메시지"
      className="fixed bottom-4 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col-reverse gap-3"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.variant];
        const Icon = style.Icon;

        return (
          <li
            key={toast.id}
            className={[
              "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
              "animate-in fade-in slide-in-from-bottom-2",
              style.containerClassName,
            ].join(" ")}
          >
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClassName}`}
            />

            <p className="min-w-0 flex-1 text-sm font-semibold text-stone-700">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="알림 닫기"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-stone-400 transition hover:bg-black/5 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
